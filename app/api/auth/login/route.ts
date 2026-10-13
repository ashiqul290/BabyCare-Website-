import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserByPhone } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Mobile number or email and password are required' },
        { status: 400 }
      );
    }

    // Search by email or phone
    let user = null;
    if (identifier.includes('@')) {
      user = await findUserByEmail(identifier);
    } else {
      user = await findUserByPhone(identifier);
    }

    // If still not found and doesn't have @, also check if admin email was entered without @ or as identifier
    if (!user && (identifier === 'admin' || identifier === 'ashiquldeveloper11@gmail.com')) {
      user = await findUserByEmail('ashiquldeveloper11@gmail.com');
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify your mobile number/email.' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid password. Please check and try again.' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

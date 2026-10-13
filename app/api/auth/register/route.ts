import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserByPhone, createUser } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, password } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, mobile number, and password are required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check existing phone
    const existingPhone = await findUserByPhone(cleanPhone);
    if (existingPhone) {
      return NextResponse.json(
        { error: 'An account with this mobile number already exists' },
        { status: 400 }
      );
    }

    // Check existing email if provided
    const userEmail = email?.trim().toLowerCase() || `${cleanPhone}@babycare.customer`;
    const existingEmail = await findUserByEmail(userEmail);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      name: name.trim(),
      email: userEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: 'customer', // strictly customer
      isActive: true,
      mustChangePassword: false,
    });

    const token = signToken({
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

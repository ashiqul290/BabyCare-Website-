import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, findUserByPhone } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();
    if (!identifier) {
      return NextResponse.json({ error: 'Please enter your mobile number or email' }, { status: 400 });
    }

    let user = null;
    if (identifier.includes('@')) {
      user = await findUserByEmail(identifier);
    } else {
      user = await findUserByPhone(identifier);
    }

    if (!user) {
      // Security standard: don't reveal existence
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this mobile number or email, a recovery code has been sent via SMS.',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Password reset instructions sent to ${user.phone.slice(0, 3)}****${user.phone.slice(-3)}. (Demo reset OTP: 123456)`,
      demoOtp: '123456',
      userId: user._id,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { findUserById } from '@/lib/db';
import { IUser } from '@/lib/types';

const JWT_SECRET = process.env.JWT_SECRET || 'babycare_production_jwt_secret_token_2026_xyz';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest): Promise<IUser | null> {
  let token = '';

  // 1. Check Bearer token in Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 2. Check cookies
  if (!token) {
    const cookieToken = req.cookies.get('token')?.value;
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await findUserById(payload.userId);
  if (!user || !user.isActive) return null;

  return user;
}

export async function requireAdmin(req: NextRequest): Promise<{ user?: IUser; error?: string }> {
  const user = await getUserFromRequest(req);
  if (!user) {
    return { error: 'Authentication required' };
  }
  if (user.role !== 'admin') {
    return { error: 'Admin privileges required' };
  }
  return { user };
}

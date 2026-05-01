import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { jwtConfig } from '../config/jwt';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema';
import type { JwtPayload } from '../types/auth.types';

const SALT_ROUNDS = 12;

const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn } as jwt.SignOptions);

const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn } as jwt.SignOptions);

export const register = async ({ email, password }: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use') as Error & { statusCode: number };
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { email, passwordHash } });

  const payload: JwtPayload = { userId: user.id, email: user.email };
  return {
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const login = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Invalid email or password') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Invalid email or password') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }

  const payload: JwtPayload = { userId: user.id, email: user.email };
  return {
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true },
  });
  if (!user) {
    const err = new Error('User not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  return user;
};

export const refresh = (token: string) => {
  try {
    const payload = jwt.verify(token, jwtConfig.refreshSecret) as JwtPayload;
    const newPayload: JwtPayload = { userId: payload.userId, email: payload.email };
    return { accessToken: signAccessToken(newPayload) };
  } catch {
    const err = new Error('Invalid or expired refresh token') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }
};

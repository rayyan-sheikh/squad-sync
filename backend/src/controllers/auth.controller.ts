import type { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import * as authService from '../services/auth.service';
import type { AuthRequest } from '../middlewares/authenticate';

const REFRESH_COOKIE = 'refreshToken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const registerHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = registerSchema.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ success: false, errors: body.error.flatten().fieldErrors });
      return;
    }

    const { user, accessToken, refreshToken } = await authService.register(body.data);
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    res.status(201).json({ success: true, user, accessToken });
  } catch (err) {
    next(err);
  }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = loginSchema.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ success: false, errors: body.error.flatten().fieldErrors });
      return;
    }

    const { user, accessToken, refreshToken } = await authService.login(body.data);
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    res.json({ success: true, user, accessToken });
  } catch (err) {
    next(err);
  }
};

export const refreshHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies[REFRESH_COOKIE] as string | undefined;
    if (!token) {
      res.status(401).json({ success: false, message: 'No refresh token' });
      return;
    }

    const { accessToken } = authService.refresh(token);
    res.json({ success: true, accessToken });
  } catch (err) {
    next(err);
  }
};

export const logoutHandler = (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_COOKIE, COOKIE_OPTIONS);
  res.json({ success: true, message: 'Logged out' });
};

export const meHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

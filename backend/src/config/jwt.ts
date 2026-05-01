export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? 'changeme',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'changeme-refresh',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
} as const;

export default () => ({
  // Application
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: process.env.CORS_CREDENTIALS === 'true',
    preflightContinue: process.env.CORS_PREFLIGHT === 'true',
    allowedHeaders:
      process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization,Accept,Accept-Language',
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS || 'Content-Length,Content-Range',
    maxAge: parseInt(process.env.CORS_MAX_AGE, 10) || 3600,
  },

  // Database
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  // OTP
  otp: {
    secret: process.env.OTP_SECRET,
    expiration: parseInt(process.env.OTP_EXPIRATION, 10) || 5,
    step: parseInt(process.env.OTP_STEP, 10) || 30,
    digits: parseInt(process.env.OTP_DIGITS, 10) || 6,
  },

  // Throttler
  throttler: {
    ttl: parseInt(process.env.THROTTLER_TTL, 10) || 60,
    limit: parseInt(process.env.THROTTLER_LIMIT, 10) || 10,
    ignoreUserAgents: process.env.THROTTLER_IGNORE_USER_AGENTS
      ? process.env.THROTTLER_IGNORE_USER_AGENTS.split(',')
      : [],
  },

  // i18n
  i18n: {
    defaultLocale: process.env.DEFAULT_LOCALE || 'en',
    fallbackLocale: process.env.FALLBACK_LOCALE || 'en',
    supportedLocales: process.env.SUPPORTED_LOCALES
      ? process.env.SUPPORTED_LOCALES.split(',')
      : ['en', 'ar'],
  },
});

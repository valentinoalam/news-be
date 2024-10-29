// import { readFileSync } from 'fs';
// import * as yaml from 'js-yaml';
// import { join } from 'path';
import { registerAs } from '@nestjs/config';

const env = process.env;

export default registerAs('app', () => ({
  environment: env.ENVIRONMENT,
  name: env.APP_NAME,
  url: env.APP_URL,
  port: env.PORT,
  corsEnabled: env.APP_CORS_ENABLED,
  nextAuthSecret: env.NEXTAUTH_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  swaggerEnabled: env.SWAGGER_ENABLED,
  swaggerDescription: env.SWAGGER_DESCRIPTION,
  swaggerVersion: env.SWAGGER_VERSION,
  swaggerPath: env.SWAGGER_PATH,
  mediaPath: env.UPLOAD_LOCATION,
  front: env.FRONTEND_URL,
  cookieName: env.COOKIE_NAME,
}));

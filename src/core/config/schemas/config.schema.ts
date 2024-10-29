import { z } from 'zod';

export const envSchema = z.object({
  APP_NAME: z.string().default('NestJS Example App'),
  APP_URL: z.string().default('http://localhost:3000'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('3000'),
  APP_CORS_ENABLED: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),
  NEXTAUTH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  SWAGGER_ENABLED: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),
  SWAGGER_DESCRIPTION: z.string().default('NestJS example app API'),
  SWAGGER_VERSION: z.string().default('1.5'),
  SWAGGER_PATH: z.string().default('api'),
});

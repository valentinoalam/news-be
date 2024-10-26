import { z } from 'zod';

export const envSchema = z.object({
  ENVIRONMENT: z.enum(['localhost', 'prod']),
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
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_IN: z.string(),
  // BCRYPT_SALT_ROUNDS: z.string().transform(val => parseInt(val, 10)).default('10'),
  // GRAPHQL_PLAYGROUND_ENABLED: z.string().transform(val => val === 'true').default('true'),
  // GRAPHQL_DEBUG: z.string().transform(val => val === 'true').default('true'),
  // GRAPHQL_SCHEMA_DESTINATION: z.string().default('schema.graphql'),
  // GRAPHQL_SORT_SCHEMA: z.string().transform(val => val === 'true').default('true'),
  // SWAGGER_ENABLED: z.string().transform(val => val === 'true').default('true'),
  SWAGGER_DESCRIPTION: z.string().default('NestJS example app API'),
  SWAGGER_VERSION: z.string().default('1.5'),
  SWAGGER_PATH: z.string().default('api'),
});

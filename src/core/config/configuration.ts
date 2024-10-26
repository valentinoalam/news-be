// import { readFileSync } from 'fs';
// import * as yaml from 'js-yaml';
// import { join } from 'path';
import { registerAs } from '@nestjs/config';

const env = process.env;
// export const YAML_CONFIG_FILENAME = 'config.yaml';
// export const config = () => {
//   return yaml.load(
//     readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
//   ) as Record<string, any>;
// };

export default registerAs('app', () => ({
  environment: env.ENVIRONMENT,
  name: env.APP_NAME,
  url: env.APP_URL,
  port: env.PORT,
  corsEnabled: env.APP_CORS_ENABLED,
  jwtAccessSecret: env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: env.JWT_REFRESH_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  jwtRefreshIn: env.JWT_REFRESH_IN,
  bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS,
  graphqlPlaygroundEnabled: env.GRAPHQL_PLAYGROUND_ENABLED,
  graphqlDebug: env.GRAPHQL_DEBUG,
  graphqlSchemaDestination: env.GRAPHQL_SCHEMA_DESTINATION,
  graphqlSortSchema: env.GRAPHQL_SORT_SCHEMA,
  swaggerEnabled: env.SWAGGER_ENABLED,
  swaggerDescription: env.SWAGGER_DESCRIPTION,
  swaggerVersion: env.SWAGGER_VERSION,
  swaggerPath: env.SWAGGER_PATH,
}));

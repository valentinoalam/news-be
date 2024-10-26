import { z } from 'zod';

import { envSchema } from '../schemas/config.schema';

export function ConfigValidator(config: Record<string, unknown>) {
  try {
    const validationResult = envSchema.parse(config);
    return validationResult;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation failed:', error);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Invalid configuration');
  }
}
// @Injectable()
// export class ConfigValidator {
//     constructor(@Inject(ConfigService) private configService: ConfigService) {}

//     validateConfig() {
//         const config = this.configService.get('app'); // Get all config
//         console.log(config)
//         try {
//             const validationResult = envSchema.parse(config);
//             console.log(validationResult)
//             return validationResult
//         } catch (error) {
//             if (error instanceof z.ZodError) {
//                 console.error('Configuration validation failed:', error);
//                 // Handle error, e.g., throw a custom error
//               } else {
//                 console.error('Unexpected error:', error);
//               }
//         }
//     }
// }

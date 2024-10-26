import { PartialType } from '@nestjs/swagger';
import { CreateAnalyticsEventDto } from './create-analytics.dto';

export class UpdateAnalyticsDto extends PartialType(CreateAnalyticsEventDto) {}

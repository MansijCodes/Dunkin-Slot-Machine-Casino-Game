import { PartialType } from '@nestjs/mapped-types';
import { CreateSpinDto } from './create-spin.dto';

export class UpdateSpinDto extends PartialType(CreateSpinDto) {}

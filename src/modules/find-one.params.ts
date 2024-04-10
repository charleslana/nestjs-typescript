import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class FindOneParams {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;
}

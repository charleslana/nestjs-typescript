import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class PageDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(20)
  pageSize: number;
}

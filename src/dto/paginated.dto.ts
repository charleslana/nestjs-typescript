import { Expose } from 'class-transformer';

export class PaginatedDto {
  @Expose()
  totalCount: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;

  @Expose()
  hasNextPage: boolean;
}

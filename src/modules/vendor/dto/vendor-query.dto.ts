export class VendorQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  isApproved?: boolean;
  isActive?: boolean;
  minRating?: number;
  city?: string;
  state?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
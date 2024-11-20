import { PrismaClient } from '@prisma/client';

export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 10));
  const skip = (page - 1) * limit;
  if (!params.orderBy) params.orderBy = 'createdAt';
  const data = {
    skip,
    limit,
    orderBy: { [params.orderBy]: params.order },
  };
  return data;
}

export async function getPaginatedData<T>(
  client: PrismaClient,
  model: string,
  query: object,
  page: number,
  limit: number,
  skip: number,
): Promise<PaginatedResponse<T>> {
  const modelClient = client[model];
  const [data, totalRecords] = await Promise.all([
    modelClient.findMany({
      ...query,
      skip,
      take: limit,
    }),
    modelClient.count(), // Get the total number of records
  ]);
  const meta = {
    total: totalRecords,
    page,
    limit,
    totalPages: Math.ceil(totalRecords / limit),
    currentPage: page,
  };
  return { data, meta };
}

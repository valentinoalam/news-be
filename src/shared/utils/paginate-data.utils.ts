import { PrismaClient } from '@prisma/client';

export interface PaginatedResult<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

export async function getPaginatedData<T>(
  client: PrismaClient,
  model: string,
  query: object,
  page: number,
  limit: number,
): Promise<PaginatedResult<T>> {
  const skip = page * limit;
  const modelClient = client[model];
  const [data, totalRecords] = await Promise.all([
    modelClient.findMany({
      ...query,
      skip,
      take: limit,
    }),
    modelClient.count(), // Get the total number of records
  ]);

  return {
    data,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
    currentPage: page,
  };
}

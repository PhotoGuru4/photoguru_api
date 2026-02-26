import { Prisma } from '@prisma/client';

export interface ConceptPackageInfo {
  price: Prisma.Decimal | number;
  estimatedDuration: number | null;
}

import { Customer as PrismaCustomer } from '@prisma/client';

export class CustomerEntity implements PrismaCustomer {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<CustomerEntity>) {
    Object.assign(this, partial);
  }
}

import {Contract} from "../corporate/contract";

export interface Installment {
  id: string;
  installmentNumber: number;
  dueDate: string; // ISO date (YYYY-MM-DD)
  amount: number;
  status: InstallmentStatus; // backend enum as string
  contract: Contract;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export type InstallmentStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export interface Pageable<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  empty: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  metadata: any[];
}

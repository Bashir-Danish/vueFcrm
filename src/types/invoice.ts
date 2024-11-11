export interface LineItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
  unitPrice: number;
  itemName: string;
  paidAmount: number;
  remainingBalance: number;
  fullyPaid: boolean;
  payments: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  shared?: boolean;
}

export interface CustomerRef {
  value: string;
  name: string;
}

export interface InvoiceCustomer {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phones: string[];
  address: string;
  quickbooksCustomerId: string;
  username: string;
  fullName: string;
}

export interface Invoice {
  id: string;
  docNumber: string;
  customerRef: {
    value: string;
    name?: string;
  };
  customer?: InvoiceCustomer;
  customerName: string;
  date: string;
  dueDate: string;
  status: 'paid' | 'partially_paid' | 'unpaid';
  totalAmount: number;
  balance: number;
  memo: string;
  lineItems: LineItem[];
  fullyPaid: boolean;
  partiallyPaid: boolean;
  payments: Payment[];
}

export interface InvoiceSummary {
  totalAmount: number;
  totalBalance: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  summary: InvoiceSummary;
}

export interface InvoicePaymentParams {
  invoiceId: string;
  amount: number;
  customerId: string;
  lineItemId: string;
} 
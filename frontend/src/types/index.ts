export type UserRole = 'employee' | 'manager' | 'accounting';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export type ExpenseStatus = 'created' | 'validated' | 'refused' | 'processed';

export interface ExpenseNote {
  _id: string;
  title: string;
  comment?: string;
  amount: number;
  category: string;
  expenseDate: string;
  attachments: string[];
  status: ExpenseStatus;
  decisionComment?: string;
  owner: string | User;
  createdAt: string;
}
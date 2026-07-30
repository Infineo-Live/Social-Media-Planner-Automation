export type UserRole = 'Admin' | 'Manager' | 'Employee';

export type UserStatus = 'Active' | 'Inactive';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

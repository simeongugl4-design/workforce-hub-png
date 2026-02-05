export type UserRole = 'ceo' | 'manager' | 'supervisor' | 'worker';
export type EmploymentType = 'permanent' | 'temporary';

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  employmentType?: EmploymentType;
  avatar?: string;
  position: string;
  supervisorId?: string;
  contractStartDate?: Date;
  contractEndDate?: Date;
  hourlyRate?: number;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

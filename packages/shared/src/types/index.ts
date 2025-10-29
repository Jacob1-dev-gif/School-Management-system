export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  attendanceToday: {
    present: number;
    absent: number;
    total: number;
    percentage: number;
  };
  feesCollected: {
    today: number;
    thisMonth: number;
    currency: string;
  };
  pendingInvoices: number;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

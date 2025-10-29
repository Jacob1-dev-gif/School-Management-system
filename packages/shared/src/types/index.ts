// Common types used across the application

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  motto?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email?: string;
  address: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Term {
  id: string;
  academicYearId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  section?: string;
  capacity?: number;
  teacherId?: string;
  academicYearId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  termId?: string;
  enrollmentDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  status: string;
  subjectId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assessment {
  id: string;
  studentId: string;
  subjectId: string;
  termId: string;
  type: string;
  score: number;
  maxScore: number;
  weight: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Fee {
  id: string;
  name: string;
  description?: string;
  amountLRD: number;
  amountUSD?: number;
  frequency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  academicYearId: string;
  termId?: string;
  totalAmountLRD: number;
  totalAmountUSD?: number;
  paidAmountLRD: number;
  paidAmountUSD?: number;
  status: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  receiptNumber: string;
  amountLRD: number;
  amountUSD?: number;
  currency: string;
  paymentMethod: string;
  paymentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportCard {
  id: string;
  studentId: string;
  termId: string;
  academicYearId: string;
  filePath?: string;
  generatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: string;
  recipient: string;
  subject: string;
  message: string;
  status: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

// Constants for Liberia-specific defaults
export const TIMEZONE = 'Africa/Monrovia';
export const DEFAULT_CURRENCY = 'LRD';
export const OPTIONAL_CURRENCY = 'USD';

// WASSCE-style grade bands
export const WASSCE_GRADE_BANDS = [
  { grade: 'A1', minScore: 75, maxScore: 100, gradePoint: 1, description: 'Excellent' },
  { grade: 'B2', minScore: 70, maxScore: 74, gradePoint: 2, description: 'Very Good' },
  { grade: 'B3', minScore: 65, maxScore: 69, gradePoint: 3, description: 'Good' },
  { grade: 'C4', minScore: 60, maxScore: 64, gradePoint: 4, description: 'Credit' },
  { grade: 'C5', minScore: 55, maxScore: 59, gradePoint: 5, description: 'Credit' },
  { grade: 'C6', minScore: 50, maxScore: 54, gradePoint: 6, description: 'Credit' },
  { grade: 'D7', minScore: 45, maxScore: 49, gradePoint: 7, description: 'Pass' },
  { grade: 'E8', minScore: 40, maxScore: 44, gradePoint: 8, description: 'Pass' },
  { grade: 'F9', minScore: 0, maxScore: 39, gradePoint: 9, description: 'Fail' },
];

// User roles
export enum UserRole {
  ADMIN = 'ADMIN',
  PRINCIPAL = 'PRINCIPAL',
  REGISTRAR = 'REGISTRAR',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  ACCOUNTANT = 'ACCOUNTANT',
  LIBRARIAN = 'LIBRARIAN',
}

// Permission types
export enum Permission {
  // Users
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_USERS = 'VIEW_USERS',
  
  // Students
  MANAGE_STUDENTS = 'MANAGE_STUDENTS',
  VIEW_STUDENTS = 'VIEW_STUDENTS',
  
  // Academic
  MANAGE_ACADEMICS = 'MANAGE_ACADEMICS',
  VIEW_ACADEMICS = 'VIEW_ACADEMICS',
  MANAGE_ATTENDANCE = 'MANAGE_ATTENDANCE',
  VIEW_ATTENDANCE = 'VIEW_ATTENDANCE',
  MANAGE_ASSESSMENTS = 'MANAGE_ASSESSMENTS',
  VIEW_ASSESSMENTS = 'VIEW_ASSESSMENTS',
  
  // Finance
  MANAGE_FINANCE = 'MANAGE_FINANCE',
  VIEW_FINANCE = 'VIEW_FINANCE',
  PROCESS_PAYMENTS = 'PROCESS_PAYMENTS',
  
  // Reports
  GENERATE_REPORTS = 'GENERATE_REPORTS',
  VIEW_REPORTS = 'VIEW_REPORTS',
  
  // System
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
}

// Notification types
export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

// Payment status
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

// Attendance status
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

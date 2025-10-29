// Liberia-specific constants
export const LIBERIA_CONFIG = {
  TIMEZONE: 'Africa/Monrovia',
  CURRENCY: {
    PRIMARY: 'LRD',
    SECONDARY: 'USD',
  },
  LOCALE: 'en-LR',
  PHONE_REGEX: /^(\+231|0)?[0-9]{8,9}$/,
} as const;

// Role constants
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

// Permission constants
export enum Permission {
  // User management
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_USERS = 'VIEW_USERS',
  
  // Academic
  MANAGE_ACADEMIC_YEAR = 'MANAGE_ACADEMIC_YEAR',
  MANAGE_CLASSES = 'MANAGE_CLASSES',
  MANAGE_SUBJECTS = 'MANAGE_SUBJECTS',
  
  // Students
  MANAGE_STUDENTS = 'MANAGE_STUDENTS',
  VIEW_STUDENTS = 'VIEW_STUDENTS',
  
  // Attendance
  MANAGE_ATTENDANCE = 'MANAGE_ATTENDANCE',
  VIEW_ATTENDANCE = 'VIEW_ATTENDANCE',
  
  // Assessments
  MANAGE_ASSESSMENTS = 'MANAGE_ASSESSMENTS',
  VIEW_ASSESSMENTS = 'VIEW_ASSESSMENTS',
  
  // Reports
  GENERATE_REPORTS = 'GENERATE_REPORTS',
  VIEW_REPORTS = 'VIEW_REPORTS',
  
  // Finance
  MANAGE_FEES = 'MANAGE_FEES',
  PROCESS_PAYMENTS = 'PROCESS_PAYMENTS',
  VIEW_FINANCE = 'VIEW_FINANCE',
  
  // System
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
}

// Grade scale for WASSCE/WAEC
export const DEFAULT_GRADE_BANDS = [
  { name: 'A1', minScore: 80, maxScore: 100, gpa: 4.0, description: 'Excellent' },
  { name: 'A2', minScore: 75, maxScore: 79, gpa: 3.75, description: 'Very Good' },
  { name: 'B2', minScore: 70, maxScore: 74, gpa: 3.5, description: 'Good' },
  { name: 'B3', minScore: 65, maxScore: 69, gpa: 3.0, description: 'Fairly Good' },
  { name: 'C4', minScore: 60, maxScore: 64, gpa: 2.5, description: 'Credit' },
  { name: 'C5', minScore: 55, maxScore: 59, gpa: 2.0, description: 'Credit' },
  { name: 'C6', minScore: 50, maxScore: 54, gpa: 1.5, description: 'Credit' },
  { name: 'D7', minScore: 45, maxScore: 49, gpa: 1.0, description: 'Pass' },
  { name: 'E8', minScore: 40, maxScore: 44, gpa: 0.5, description: 'Pass' },
  { name: 'F9', minScore: 0, maxScore: 39, gpa: 0.0, description: 'Fail' },
];

// Assessment component types
export enum AssessmentType {
  CONTINUOUS = 'CONTINUOUS',
  MIDTERM = 'MIDTERM',
  EXAM = 'EXAM',
}

// Notification types
export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}

// Payment status
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

// Fee types
export enum FeeType {
  TUITION = 'TUITION',
  REGISTRATION = 'REGISTRATION',
  EXAM = 'EXAM',
  LIBRARY = 'LIBRARY',
  SPORTS = 'SPORTS',
  TRANSPORT = 'TRANSPORT',
  UNIFORM = 'UNIFORM',
  OTHER = 'OTHER',
}

// Attendance status
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

// Term types
export enum TermType {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
}

// Liberia-specific constants
export const TIMEZONE = 'Africa/Monrovia';
export const DEFAULT_CURRENCY = 'LRD';
export const SECONDARY_CURRENCY = 'USD';

// WASSCE Grade Scale
export const WASSCE_GRADES = [
  { band: 'A1', min: 90, max: 100, points: 1, description: 'Excellent' },
  { band: 'A2', min: 80, max: 89, points: 2, description: 'Very Good' },
  { band: 'B3', min: 70, max: 79, points: 3, description: 'Good' },
  { band: 'C4', min: 60, max: 69, points: 4, description: 'Credit' },
  { band: 'C5', min: 50, max: 59, points: 5, description: 'Credit' },
  { band: 'C6', min: 45, max: 49, points: 6, description: 'Credit' },
  { band: 'D7', min: 40, max: 44, points: 7, description: 'Pass' },
  { band: 'E8', min: 30, max: 39, points: 8, description: 'Pass' },
  { band: 'F9', min: 0, max: 29, points: 9, description: 'Fail' },
];

// User Roles
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

// Academic Periods
export enum TermName {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
}

// Attendance Status
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

// Payment Status
export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

// Notification Types
export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

// Job Queue Names
export const QUEUE_NAMES = {
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports',
  SCHEDULED: 'scheduled',
};

// Assessment Types
export enum AssessmentType {
  CONTINUOUS_ASSESSMENT = 'CONTINUOUS_ASSESSMENT',
  MID_TERM = 'MID_TERM',
  FINAL_EXAM = 'FINAL_EXAM',
}

// Default Assessment Weights (Liberia standard)
export const DEFAULT_ASSESSMENT_WEIGHTS = {
  CONTINUOUS_ASSESSMENT: 40,
  FINAL_EXAM: 60,
};

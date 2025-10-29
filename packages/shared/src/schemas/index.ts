import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().regex(/^(\+231|0)?[0-9]{8,9}$/).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordConfirmSchema = z.object({
  token: z.string(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
});

// Student schemas
export const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  dateOfBirth: z.string().or(z.date()),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().optional(),
  phone: z.string().regex(/^(\+231|0)?[0-9]{8,9}$/).optional(),
  email: z.string().email().optional(),
  guardianId: z.string().uuid().optional(),
  admissionDate: z.string().or(z.date()),
  studentId: z.string().optional(),
});

// Academic Year schema
export const createAcademicYearSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  current: z.boolean().default(false),
});

// Class schema
export const createClassSchema = z.object({
  name: z.string().min(1),
  gradeLevel: z.number().int().min(1).max(12),
  section: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  academicYearId: z.string().uuid(),
});

// Subject schema
export const createSubjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
  creditHours: z.number().int().positive().optional(),
});

// Attendance schema
export const createAttendanceSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid(),
  date: z.string().or(z.date()),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  subjectId: z.string().uuid().optional(),
  remarks: z.string().optional(),
});

// Assessment schema
export const createAssessmentSchema = z.object({
  studentId: z.string().uuid(),
  subjectId: z.string().uuid(),
  termId: z.string().uuid(),
  type: z.enum(['CONTINUOUS', 'MIDTERM', 'EXAM']),
  score: z.number().min(0).max(100),
  maxScore: z.number().min(0).max(100).default(100),
  weight: z.number().min(0).max(1).optional(),
  date: z.string().or(z.date()).optional(),
});

// Fee schema
export const createFeeSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['TUITION', 'REGISTRATION', 'EXAM', 'LIBRARY', 'SPORTS', 'TRANSPORT', 'UNIFORM', 'OTHER']),
  amountLRD: z.number().positive(),
  amountUSD: z.number().positive().optional(),
  academicYearId: z.string().uuid(),
  termId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  dueDate: z.string().or(z.date()).optional(),
});

// Payment schema
export const createPaymentSchema = z.object({
  invoiceId: z.string().uuid(),
  amountLRD: z.number().positive(),
  amountUSD: z.number().positive().optional(),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHECK', 'OTHER']),
  reference: z.string().optional(),
  notes: z.string().optional(),
  paymentDate: z.string().or(z.date()).optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type ResetPasswordRequestDto = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordConfirmDto = z.infer<typeof resetPasswordConfirmSchema>;
export type CreateStudentDto = z.infer<typeof createStudentSchema>;
export type CreateAcademicYearDto = z.infer<typeof createAcademicYearSchema>;
export type CreateClassDto = z.infer<typeof createClassSchema>;
export type CreateSubjectDto = z.infer<typeof createSubjectSchema>;
export type CreateAttendanceDto = z.infer<typeof createAttendanceSchema>;
export type CreateAssessmentDto = z.infer<typeof createAssessmentSchema>;
export type CreateFeeDto = z.infer<typeof createFeeSchema>;
export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;

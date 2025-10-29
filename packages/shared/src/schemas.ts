import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordConfirmSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  roles: z.array(z.string()).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  roles: z.array(z.string()).optional(),
});

// Academic Year schemas
export const createAcademicYearSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isCurrent: z.boolean().optional(),
});

// Term schemas
export const createTermSchema = z.object({
  name: z.string().min(1),
  academicYearId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isCurrent: z.boolean().optional(),
});

// Class schemas
export const createClassSchema = z.object({
  name: z.string().min(1),
  grade: z.string().min(1),
  section: z.string().optional(),
  academicYearId: z.string().uuid(),
  teacherId: z.string().uuid().optional(),
});

// Subject schemas
export const createSubjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
});

// Student schemas
export const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  dateOfBirth: z.string().datetime(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  userId: z.string().uuid().optional(),
});

// Guardian schemas
export const createGuardianSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  relationship: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(1),
  address: z.string().optional(),
  userId: z.string().uuid().optional(),
});

// Enrollment schemas
export const createEnrollmentSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid(),
  academicYearId: z.string().uuid(),
  enrollmentDate: z.string().datetime(),
});

// Attendance schemas
export const createAttendanceSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid(),
  date: z.string().datetime(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  subjectId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

// Assessment schemas
export const createAssessmentSchema = z.object({
  studentId: z.string().uuid(),
  subjectId: z.string().uuid(),
  termId: z.string().uuid(),
  componentName: z.string().min(1),
  score: z.number().min(0).max(100),
  maxScore: z.number().min(1),
  weight: z.number().min(0).max(100).optional(),
});

// Fee schemas
export const createFeeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  amountLRD: z.number().min(0),
  amountUSD: z.number().min(0).optional(),
  academicYearId: z.string().uuid(),
  termId: z.string().uuid().optional(),
  isRecurring: z.boolean().optional(),
});

// Invoice schemas
export const createInvoiceSchema = z.object({
  studentId: z.string().uuid(),
  feeScheduleId: z.string().uuid(),
  dueDate: z.string().datetime(),
  amountLRD: z.number().min(0),
  amountUSD: z.number().min(0).optional(),
});

// Payment schemas
export const createPaymentSchema = z.object({
  invoiceId: z.string().uuid(),
  amountLRD: z.number().min(0),
  amountUSD: z.number().min(0).optional(),
  paymentMethod: z.string().min(1),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordConfirmInput = z.infer<typeof resetPasswordConfirmSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateAcademicYearInput = z.infer<typeof createAcademicYearSchema>;
export type CreateTermInput = z.infer<typeof createTermSchema>;
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type CreateGuardianInput = z.infer<typeof createGuardianSchema>;
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type CreateFeeInput = z.infer<typeof createFeeSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

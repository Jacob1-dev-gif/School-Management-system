import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// User schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Student schemas
export const createStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  dateOfBirth: z.string().or(z.date()),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export const updateStudentSchema = createStudentSchema.partial();

// Guardian schemas
export const createGuardianSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email().optional(),
  address: z.string().min(1, 'Address is required'),
});

export const updateGuardianSchema = createGuardianSchema.partial();

// Academic Year schemas
export const createAcademicYearSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isCurrent: z.boolean().default(false),
});

export const updateAcademicYearSchema = createAcademicYearSchema.partial();

// Term schemas
export const createTermSchema = z.object({
  academicYearId: z.string().uuid('Invalid academic year ID'),
  name: z.enum(['FIRST', 'SECOND', 'THIRD']),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isCurrent: z.boolean().default(false),
});

export const updateTermSchema = createTermSchema.partial();

// Class schemas
export const createClassSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  grade: z.string().min(1, 'Grade is required'),
  section: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  teacherId: z.string().uuid().optional(),
  academicYearId: z.string().uuid('Invalid academic year ID'),
});

export const updateClassSchema = createClassSchema.partial();

// Subject schemas
export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  credits: z.number().int().positive().optional(),
});

export const updateSubjectSchema = createSubjectSchema.partial();

// Attendance schemas
export const createAttendanceSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  classId: z.string().uuid('Invalid class ID'),
  date: z.string().or(z.date()),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  subjectId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export const bulkAttendanceSchema = z.object({
  classId: z.string().uuid('Invalid class ID'),
  date: z.string().or(z.date()),
  subjectId: z.string().uuid().optional(),
  attendances: z.array(
    z.object({
      studentId: z.string().uuid('Invalid student ID'),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
      notes: z.string().optional(),
    })
  ),
});

// Assessment schemas
export const createAssessmentSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  subjectId: z.string().uuid('Invalid subject ID'),
  termId: z.string().uuid('Invalid term ID'),
  type: z.enum(['CONTINUOUS_ASSESSMENT', 'MID_TERM', 'FINAL_EXAM']),
  score: z.number().min(0).max(100),
  maxScore: z.number().min(0).max(100).default(100),
  weight: z.number().min(0).max(100),
  date: z.string().or(z.date()),
});

export const updateAssessmentSchema = createAssessmentSchema.partial();

// Fee schemas
export const createFeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  amountLRD: z.number().min(0, 'Amount must be positive'),
  amountUSD: z.number().min(0).optional(),
  frequency: z.enum(['ONE_TIME', 'TERM', 'ANNUAL']),
});

export const updateFeeSchema = createFeeSchema.partial();

// Invoice schemas
export const createInvoiceSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  academicYearId: z.string().uuid('Invalid academic year ID'),
  termId: z.string().uuid().optional(),
  items: z.array(
    z.object({
      feeId: z.string().uuid('Invalid fee ID'),
      quantity: z.number().int().positive().default(1),
    })
  ),
  dueDate: z.string().or(z.date()),
});

// Payment schemas
export const createPaymentSchema = z.object({
  invoiceId: z.string().uuid('Invalid invoice ID'),
  amountLRD: z.number().min(0, 'Amount must be positive'),
  amountUSD: z.number().min(0).optional(),
  currency: z.enum(['LRD', 'USD']).default('LRD'),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHEQUE']),
  paymentDate: z.string().or(z.date()),
  notes: z.string().optional(),
});

// Notification schemas
export const sendNotificationSchema = z.object({
  type: z.enum(['EMAIL', 'SMS']),
  recipient: z.string().min(1, 'Recipient is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

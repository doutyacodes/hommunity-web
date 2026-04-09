import { mysqlTable, varchar, text, boolean, datetime, json, mysqlEnum, decimal, timestamp } from 'drizzle-orm/mysql-core';
import { randomUUID } from 'crypto';

// --- THE 3 SEPARATE IDENTITY TABLES --- 

// 1. Admins (Web Dashboard)
export const admins = mysqlTable('admins', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['SUPERADMIN', 'ADMIN']).notNull(), // Web roles
  permissions: json('permissions').$type<string[]>(), // e.g. ["RESIDENT_WRITE", "REPORTS_READ"] 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 2. Residents (Mobile App)
export const residents = mysqlTable('residents', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  email: varchar('email', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 3. Guards (Mobile App)
export const guards = mysqlTable('guards', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  email: varchar('email', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});


// --- CORE SYSTEM MANAGED BY ADMINS ---
export const buildings = mysqlTable('buildings', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  imageUrl: text('image_url'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const buildingAdmins = mysqlTable('building_admins', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  adminId: varchar('admin_id', { length: 36 }).notNull().references(() => admins.id),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
});

export const blocks = mysqlTable('blocks', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  name: varchar('name', { length: 255 }).notNull(),
});

export const floors = mysqlTable('floors', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  blockId: varchar('block_id', { length: 36 }), 
  floorNumber: varchar('floor_number', { length: 50 }).notNull(), 
});

export const apartments = mysqlTable('apartments', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  floorId: varchar('floor_id', { length: 36 }).notNull().references(() => floors.id),
  unitNumber: varchar('unit_number', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }),
});

export const apartmentResidents = mysqlTable('apartment_residents', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  residentId: varchar('resident_id', { length: 36 }).notNull().references(() => residents.id),
  apartmentId: varchar('apartment_id', { length: 36 }).notNull().references(() => apartments.id),
  type: mysqlEnum('type', ['OWNER', 'TENANT']).notNull(),
  status: mysqlEnum('status', ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'INACTIVE_PAST']).notNull().default('PENDING_APPROVAL'),
  canApproveVisitors: boolean('can_approve_visitors').default(true).notNull(), // Privileges!
  startDate: datetime('start_date'),
  endDate: datetime('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- GATE & SECURITY PERSONNEL ---
export const gates = mysqlTable('gates', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  name: varchar('name', { length: 255 }).notNull(),
});

export const securityShifts = mysqlTable('security_shifts', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  guardId: varchar('guard_id', { length: 36 }).notNull().references(() => guards.id),
  gateId: varchar('gate_id', { length: 36 }).notNull().references(() => gates.id),
  shiftStart: datetime('shift_start').notNull(),
  shiftEnd: datetime('shift_end').notNull(),
});

export const securityAlerts = mysqlTable('security_alerts', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  guardId: varchar('guard_id', { length: 36 }).notNull().references(() => guards.id),
  type: mysqlEnum('type', ['FIRE', 'MEDICAL', 'SOS_BREACH']).notNull(),
  status: mysqlEnum('status', ['ACTIVE', 'RESOLVED']).default('ACTIVE'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// --- RULES & QUESTIONNAIRES ---
export const rules = mysqlTable('rules', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  createdBy: varchar('created_by', { length: 36 }).notNull().references(() => admins.id), 
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  isApproved: boolean('is_approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const customQuestions = mysqlTable('custom_questions', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  questionText: text('question_text').notNull(),
  fieldType: mysqlEnum('field_type', ['TEXT', 'NUMBER', 'DROPDOWN', 'FILE']).notNull(),
  isRequired: boolean('is_required').default(true),
});

export const residentAnswers = mysqlTable('resident_answers', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  questionId: varchar('question_id', { length: 36 }).notNull().references(() => customQuestions.id),
  residentId: varchar('resident_id', { length: 36 }).notNull().references(() => residents.id),
  answerText: text('answer_text').notNull(),
});

// --- MOBILE APP CONSOLIDATED GATE OPERATIONS ---
export const visitors = mysqlTable('visitors', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  apartmentId: varchar('apartment_id', { length: 36 }).notNull().references(() => apartments.id),
  invitedByResidentId: varchar('invited_by_resident_id', { length: 36 }).references(() => residents.id), 
  
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  visitorCategory: mysqlEnum('visitor_category', [
    'EXPECTED_GUEST',
    'DELIVERY_GUEST',
    'SERVICE_STAFF',
    'DAILY_STAFF',
    'CAB_RIDE',
    'EVENT_BULK',
    'UNINVITED'
  ]).notNull(),
  associatedAgency: varchar('associated_agency', { length: 100 }), 
  
  purpose: text('purpose'), 
  status: mysqlEnum('status', ['EXPECTED', 'AT_GATE', 'INSIDE', 'EXITED', 'DENIED', 'DELIVERED_TO_SECURITY']).notNull(),
  
  entryTime: datetime('entry_time'),
  exitTime: datetime('exit_time'),
  vehicleNo: varchar('vehicle_no', { length: 50 }),
  photoUrl: text('photo_url'),
  passCode: varchar('pass_code', { length: 20 }), 
});

// --- MOBILE APP RESIDENT DATA ---
export const familyMembers = mysqlTable('family_members', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  parentResidentId: varchar('parent_resident_id', { length: 36 }).notNull().references(() => residents.id),
  name: varchar('name', { length: 255 }).notNull(),
  relation: varchar('relation', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  photoUrl: text('photo_url'),
  canApproveVisitors: boolean('can_approve_visitors').default(false).notNull(), // Privileges!
});

export const vehicles = mysqlTable('vehicles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  residentId: varchar('resident_id', { length: 36 }).notNull().references(() => residents.id),
  vehicleType: mysqlEnum('vehicle_type', ['CAR', 'BIKE', 'OTHER']).notNull(),
  numberPlate: varchar('number_plate', { length: 50 }).notNull(),
  model: varchar('model', { length: 100 }),
});

export const communityNotices = mysqlTable('community_notices', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  authorAdminId: varchar('author_admin_id', { length: 36 }).references(() => admins.id),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  type: mysqlEnum('type', ['NOTICE', 'POLL']).default('NOTICE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const civicComplaints = mysqlTable('civic_complaints', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  residentId: varchar('resident_id', { length: 36 }).notNull().references(() => residents.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: mysqlEnum('status', ['OPEN', 'IN_PROGRESS', 'RESOLVED']).default('OPEN').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payments = mysqlTable('payments', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  apartmentId: varchar('apartment_id', { length: 36 }).notNull().references(() => apartments.id),
  residentId: varchar('resident_id', { length: 36 }).notNull().references(() => residents.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum('status', ['PENDING', 'PAID', 'OVERDUE']).default('PENDING').notNull(),
  internalRef: varchar('internal_ref', { length: 100 }),
  dueDate: datetime('due_date'),
  paidDate: datetime('paid_date'),
});

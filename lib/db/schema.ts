import { mysqlTable, varchar, text, boolean, datetime, json, mysqlEnum, decimal, timestamp, index } from 'drizzle-orm/mysql-core';
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
  pushToken: varchar('push_token', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  phoneIdx: index('res_phone_idx').on(table.phone),
}));

// 3. Guards (Mobile App)
export const guards = mysqlTable('guards', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  email: varchar('email', { length: 255 }),
  pushToken: varchar('push_token', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  buildingId: varchar('building_id', { length: 36 }).references(() => buildings.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  phoneIdx: index('guard_phone_idx').on(table.phone),
  buildingIdx: index('guard_building_idx').on(table.buildingId),
}));


// --- CORE SYSTEM MANAGED BY ADMINS ---
export const buildings = mysqlTable('buildings', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  imageUrl: text('image_url'),
  status: mysqlEnum('status', ['ACTIVE', 'DISABLED']).default('ACTIVE').notNull(),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const buildingAdmins = mysqlTable('building_admins', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  adminId: varchar('admin_id', { length: 36 }).notNull().references(() => admins.id),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
}, (table) => ({
  adminIdx: index('bad_admin_idx').on(table.adminId),
  buildingIdx: index('bad_building_idx').on(table.buildingId),
}));

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
}, (table) => ({
  buildingIdx: index('apt_building_idx').on(table.buildingId),
  unitIdx: index('apt_unit_idx').on(table.unitNumber),
}));

export const apartmentResidents = mysqlTable('apartment_residents', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  residentId: varchar('resident_id', { length: 36 }).notNull().references(() => residents.id),
  apartmentId: varchar('apartment_id', { length: 36 }).notNull().references(() => apartments.id),
  type: mysqlEnum('type', ['OWNER', 'TENANT', 'FAMILY']).notNull(),
  relation: varchar('relation', { length: 100 }), // Added for FAMILY members
  status: mysqlEnum('status', ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'INACTIVE_PAST', 'INVITED']).notNull().default('PENDING_APPROVAL'),
  documents: json('documents').$type<string[]>(), // Added for IDs and Leases
  canApproveVisitors: boolean('can_approve_visitors').default(true).notNull(), // Privileges!
  isPrimary: boolean('is_primary').default(false).notNull(), 
  startDate: datetime('start_date'),
  endDate: datetime('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  resIdx: index('ar_res_idx').on(table.residentId),
  aptIdx: index('ar_apt_idx').on(table.apartmentId),
}));

export const familyInvitations = mysqlTable('family_invitations', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  apartmentId: varchar('apartment_id', { length: 36 }).notNull().references(() => apartments.id),
  inviterResidentId: varchar('inviter_resident_id', { length: 36 }).notNull().references(() => residents.id),
  phone: varchar('phone', { length: 20 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  relation: varchar('relation', { length: 100 }),
  status: mysqlEnum('status', ['PENDING', 'ACCEPTED', 'DENIED']).default('PENDING'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  phoneIdx: index('fi_phone_idx').on(table.phone),
  aptIdx: index('fi_apt_idx').on(table.apartmentId),
}));

export const pets = mysqlTable('pets', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  residentId: varchar('resident_id', { length: 36 }).notNull().references(() => residents.id),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(), // Dog, Cat, etc.
  breed: varchar('breed', { length: 255 }),
  photoUrl: text('photo_url'),
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
  startTime: varchar('start_time', { length: 10 }).notNull(), // HH:mm
  endTime: varchar('end_time', { length: 10 }).notNull(), // HH:mm
}, (table) => ({
  guardIdx: index('shift_guard_idx').on(table.guardId),
  gateIdx: index('shift_gate_idx').on(table.gateId),
}));

export const securityShiftDays = mysqlTable('security_shift_days', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  shiftId: varchar('shift_id', { length: 36 }).notNull().references(() => securityShifts.id),
  day: mysqlEnum('day', ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']).notNull(),
}, (table) => ({
  shiftIdx: index('shift_day_idx').on(table.shiftId),
}));

export const guardAttendance = mysqlTable('guard_attendance', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  guardId: varchar('guard_id', { length: 36 }).notNull().references(() => guards.id),
  shiftId: varchar('shift_id', { length: 36 }).notNull().references(() => securityShifts.id),
  checkIn: timestamp('check_in'),
  checkOut: timestamp('check_out'),
  status: mysqlEnum('status', ['ON_TIME', 'LATE', 'ABSENT', 'ON_LEAVE']).default('ON_TIME'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  guardIdx: index('attendance_guard_idx').on(table.guardId),
}));

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
  
  isPrivate: boolean('is_private').default(false).notNull(),
  participantCount: decimal('participant_count', { precision: 5, scale: 0 }).default('1'),
  schedulingDetails: json('scheduling_details'), // e.g. { type: 'DAILY', days: ['MON', 'WED'], timeSlot: '09:00-11:00' }

  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  phoneIdx: index('visitor_phone_idx').on(table.phone),
  buildingIdx: index('visitor_building_idx').on(table.buildingId),
}));

export const visitorLogs = mysqlTable('visitor_logs', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  visitorId: varchar('visitor_id', { length: 36 }).notNull().references(() => visitors.id),
  action: mysqlEnum('action', ['CHECK_IN', 'CHECK_OUT', 'DENIED', 'APPROVED', 'PRE_APPROVED']).notNull(),
  performedByRole: mysqlEnum('performed_by_role', ['ADMIN', 'RESIDENT', 'GUARD']).notNull(),
  performedById: varchar('performed_by_id', { length: 36 }).notNull(),
  notes: text('notes'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  visitorIdx: index('log_visitor_idx').on(table.visitorId),
}));

export const blacklistedVisitors = mysqlTable('blacklisted_visitors', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  phone: varchar('phone', { length: 20 }).notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  phoneIdx: index('blacklist_phone_idx').on(table.phone, table.buildingId),
}));


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
}, (table) => ({
  buildingIdx: index('comp_building_idx').on(table.buildingId),
  resIdx: index('comp_res_idx').on(table.residentId),
}));

// --- PAYMENTS ---
export const payments = mysqlTable('payments', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  apartmentId: varchar('apartment_id', { length: 36 }).notNull().references(() => apartments.id),
  residentId: varchar('resident_id', { length: 36 }).notNull().references(() => residents.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum('status', ['PENDING', 'PAID', 'OVERDUE']).default('PENDING').notNull(),
  internalRef: varchar('internal_ref', { length: 100 }),
  buildingId: varchar('building_id', { length: 36 }).references(() => buildings.id),
  dueDate: datetime('due_date'),
  paidDate: datetime('paid_date'),
}, (table) => ({
  resIdx: index('pay_res_idx').on(table.residentId),
  buildingIdx: index('pay_building_idx').on(table.buildingId),
}));

// --- GLOBAL SECURITY RULES ---
export const globalRules = mysqlTable('global_rules', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: mysqlEnum('status', ['ACTIVE', 'DISABLED']).default('ACTIVE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const notifications = mysqlTable('notifications', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  userType: mysqlEnum('user_type', ['RESIDENT', 'GUARD']).notNull(), 
  userId: varchar('user_id', { length: 36 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // GUEST_ARRIVAL, SOS_ALERT
  
  // Action support for deep-linking/lock-screen actions
  actionType: varchar('action_type', { length: 50 }), // e.g. "VISITOR_APPROVAL"
  referenceId: varchar('reference_id', { length: 36 }), // e.g. visitorId
  payload: json('payload'), 
  
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('user_idx').on(table.userId, table.userType),
}));

export const eventLogs = mysqlTable('event_logs', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  buildingId: varchar('building_id', { length: 36 }).notNull().references(() => buildings.id),
  category: mysqlEnum('category', ['VISITOR', 'SECURITY', 'MAINTENANCE', 'PAYMENT', 'NOTICE']).notNull(),
  eventName: varchar('event_name', { length: 255 }).notNull(), // e.g., "GUEST_CHECKIN", "SOS_TRIGGER"
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  buildingIdx: index('event_building_idx').on(table.buildingId),
}));
export const userPushTokens = mysqlTable('user_push_tokens', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  userType: mysqlEnum('user_type', ['RESIDENT', 'GUARD']).notNull(),
  pushToken: varchar('push_token', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userTokenIdx: index('user_token_idx').on(table.userId, table.userType),
}));

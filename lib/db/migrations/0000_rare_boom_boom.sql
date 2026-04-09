CREATE TABLE `apartment_residents` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`apartment_id` varchar(36) NOT NULL,
	`type` enum('OWNER','TENANT') NOT NULL,
	`status` enum('PENDING_APPROVAL','APPROVED','REJECTED','INACTIVE_PAST') NOT NULL DEFAULT 'PENDING_APPROVAL',
	`start_date` datetime,
	`end_date` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `apartment_residents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `apartments` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`floor_id` varchar(36) NOT NULL,
	`unit_number` varchar(100) NOT NULL,
	`type` varchar(50),
	CONSTRAINT `apartments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blocks` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `blocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `building_admins` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`assigned_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `building_admins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `buildings` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`image_url` text,
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `buildings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `civic_complaints` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`status` enum('OPEN','IN_PROGRESS','RESOLVED') NOT NULL DEFAULT 'OPEN',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `civic_complaints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_notices` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`author_id` varchar(36),
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`type` enum('NOTICE','POLL') NOT NULL DEFAULT 'NOTICE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_notices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custom_questions` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`question_text` text NOT NULL,
	`field_type` enum('TEXT','NUMBER','DROPDOWN','FILE') NOT NULL,
	`is_required` boolean DEFAULT true,
	CONSTRAINT `custom_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deliveries` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`apartment_id` varchar(36) NOT NULL,
	`provider_name` varchar(100),
	`executive_name` varchar(255),
	`status` enum('EXPECTED','AT_GATE','DELIVERED_TO_SECURITY','COMPLETED') NOT NULL,
	`leave_at_gate` boolean DEFAULT false,
	`entry_time` datetime,
	`exit_time` datetime,
	CONSTRAINT `deliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `family_members` (
	`id` varchar(36) NOT NULL,
	`parent_user_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`relation` varchar(100) NOT NULL,
	`phone` varchar(20),
	`photo_url` text,
	CONSTRAINT `family_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `floors` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`block_id` varchar(36),
	`floor_number` varchar(50) NOT NULL,
	CONSTRAINT `floors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gates` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `gates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(36) NOT NULL,
	`apartment_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('PENDING','PAID','OVERDUE') NOT NULL DEFAULT 'PENDING',
	`internal_ref` varchar(100),
	`due_date` datetime,
	`paid_date` datetime,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resident_answers` (
	`id` varchar(36) NOT NULL,
	`question_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`answer_text` text NOT NULL,
	CONSTRAINT `resident_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rules` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`created_by` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`is_approved` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `security_alerts` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`guard_id` varchar(36) NOT NULL,
	`type` enum('FIRE','MEDICAL','SOS_BREACH') NOT NULL,
	`status` enum('ACTIVE','RESOLVED') DEFAULT 'ACTIVE',
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `security_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `security_shifts` (
	`id` varchar(36) NOT NULL,
	`guard_id` varchar(36) NOT NULL,
	`gate_id` varchar(36) NOT NULL,
	`shift_start` datetime NOT NULL,
	`shift_end` datetime NOT NULL,
	CONSTRAINT `security_shifts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20),
	`email` varchar(255),
	`password_hash` varchar(255) NOT NULL,
	`role` enum('SUPERADMIN','ADMIN','GUARD','RESIDENT') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`vehicle_type` enum('CAR','BIKE','OTHER') NOT NULL,
	`number_plate` varchar(50) NOT NULL,
	`model` varchar(100),
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitors` (
	`id` varchar(36) NOT NULL,
	`building_id` varchar(36) NOT NULL,
	`apartment_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20),
	`purpose` text,
	`visitor_type` varchar(100),
	`status` enum('EXPECTED','AT_GATE','INSIDE','EXITED','DENIED') NOT NULL,
	`entry_time` datetime,
	`exit_time` datetime,
	`vehicle_no` varchar(50),
	`photo_url` text,
	`pass_code` varchar(20),
	CONSTRAINT `visitors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `apartment_residents` ADD CONSTRAINT `apartment_residents_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `apartment_residents` ADD CONSTRAINT `apartment_residents_apartment_id_apartments_id_fk` FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `apartments` ADD CONSTRAINT `apartments_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `apartments` ADD CONSTRAINT `apartments_floor_id_floors_id_fk` FOREIGN KEY (`floor_id`) REFERENCES `floors`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blocks` ADD CONSTRAINT `blocks_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `building_admins` ADD CONSTRAINT `building_admins_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `building_admins` ADD CONSTRAINT `building_admins_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `civic_complaints` ADD CONSTRAINT `civic_complaints_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `civic_complaints` ADD CONSTRAINT `civic_complaints_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `community_notices` ADD CONSTRAINT `community_notices_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `community_notices` ADD CONSTRAINT `community_notices_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `custom_questions` ADD CONSTRAINT `custom_questions_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deliveries` ADD CONSTRAINT `deliveries_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deliveries` ADD CONSTRAINT `deliveries_apartment_id_apartments_id_fk` FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `family_members` ADD CONSTRAINT `family_members_parent_user_id_users_id_fk` FOREIGN KEY (`parent_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `floors` ADD CONSTRAINT `floors_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gates` ADD CONSTRAINT `gates_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_apartment_id_apartments_id_fk` FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resident_answers` ADD CONSTRAINT `resident_answers_question_id_custom_questions_id_fk` FOREIGN KEY (`question_id`) REFERENCES `custom_questions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resident_answers` ADD CONSTRAINT `resident_answers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rules` ADD CONSTRAINT `rules_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rules` ADD CONSTRAINT `rules_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `security_alerts` ADD CONSTRAINT `security_alerts_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `security_alerts` ADD CONSTRAINT `security_alerts_guard_id_users_id_fk` FOREIGN KEY (`guard_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `security_shifts` ADD CONSTRAINT `security_shifts_guard_id_users_id_fk` FOREIGN KEY (`guard_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `security_shifts` ADD CONSTRAINT `security_shifts_gate_id_gates_id_fk` FOREIGN KEY (`gate_id`) REFERENCES `gates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `visitors` ADD CONSTRAINT `visitors_building_id_buildings_id_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `visitors` ADD CONSTRAINT `visitors_apartment_id_apartments_id_fk` FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE no action ON UPDATE no action;
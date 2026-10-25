CREATE TABLE `plays` (
	`user_id` text NOT NULL,
	`played_at` integer NOT NULL,
	`track_id` text NOT NULL,
	`track` text NOT NULL,
	PRIMARY KEY(`user_id`, `played_at`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`spotify_user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `plays_user_played` ON `plays` (`user_id`,`played_at`);--> statement-breakpoint
CREATE TABLE `top_snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`range` text NOT NULL,
	`taken_at` integer NOT NULL,
	`day` text NOT NULL,
	`items` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`spotify_user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `snapshot_user_kind_range_day` ON `top_snapshots` (`user_id`,`kind`,`range`,`day`);--> statement-breakpoint
CREATE INDEX `snapshot_user_kind_range_taken` ON `top_snapshots` (`user_id`,`kind`,`range`,`taken_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`spotify_user_id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`last_snapshot_at` integer,
	`last_history_sync_at` integer
);

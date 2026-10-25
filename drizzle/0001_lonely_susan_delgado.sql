CREATE TABLE `friendships` (
	`user_a` text NOT NULL,
	`user_b` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_a`, `user_b`),
	FOREIGN KEY (`user_a`) REFERENCES `users`(`spotify_user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_b`) REFERENCES `users`(`spotify_user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `invites` (
	`token` text PRIMARY KEY NOT NULL,
	`inviter_user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`revoked_at` integer,
	FOREIGN KEY (`inviter_user_id`) REFERENCES `users`(`spotify_user_id`) ON UPDATE no action ON DELETE cascade
);

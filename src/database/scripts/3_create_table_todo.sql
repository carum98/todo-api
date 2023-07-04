USE `todo`;

CREATE TABLE `todos` (
    `id` int AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `title` text NOT NULL,
    `description` text NOT NULL,
    `is_complete` boolean NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
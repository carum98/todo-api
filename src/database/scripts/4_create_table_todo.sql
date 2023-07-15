USE `todo`;

CREATE TABLE `todos` (
    `id` int AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `list_id` int NOT NULL,
    `title` text NOT NULL,
    `is_complete` boolean NOT NULL,
    `position` int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (list_id) REFERENCES lists(id)
);
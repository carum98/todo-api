USE `todo`;

CREATE TABLE `refresh_tokens` (
    `id` int AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `token` text NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
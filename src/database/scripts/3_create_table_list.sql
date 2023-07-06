USE `todo`;

CREATE TABLE `lists` (
    `id` int AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `name` text NOT NULL,
    `color` text NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
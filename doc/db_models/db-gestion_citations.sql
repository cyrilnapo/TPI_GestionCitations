CREATE TABLE users (
    id INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    PRIMARY KEY (id)
);

CREATE TABLE movies (
    id INT AUTO_INCREMENT,
    title_fr VARCHAR(50) NOT NULL,
    title_en VARCHAR(50) NOT NULL,
    release_date DATE NOT NULL,
    image_path VARCHAR(255),
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE quotes (
    id INT AUTO_INCREMENT,
    text VARCHAR(255) NOT NULL,
    character_name VARCHAR(50) NOT NULL,
    actor_name VARCHAR(50) NOT NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    movie_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
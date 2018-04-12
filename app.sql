CREATE DATABASE discussionfairy CHARACTER SET utf8mb4;

CREATE TABLE discussion (
  updateTime bigint(20) NOT NULL,
  language VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  discussionId VARCHAR(100) NOT NULL,
  data VARCHAR(300) DEFAULT NULL,
  comments int(11) DEFAULT NULL,
  likes int(11) DEFAULT NULL,
  dislikes int(11) DEFAULT NULL,
  popularity int(11) DEFAULT NULL,
  PRIMARY KEY (updateTime,language,location,discussionId),
  UNIQUE KEY discussions_discussionId_idx (discussionId),
  KEY discussions_language_idx (language),
  KEY discussions_location_idx (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE topic (
  updateTime bigint(20) NOT NULL,
  location VARCHAR(100) NOT NULL,
  language VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  discussionId VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (updateTime,location,language,name),
  KEY topics_discussionId_idx (discussionId),
  KEY topics_location_idx (location),
  KEY topics_language_idx (language),
  CONSTRAINT topics_discussionId_fk FOREIGN KEY (discussionId) REFERENCES discussion (discussionId) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

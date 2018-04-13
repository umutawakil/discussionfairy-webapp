-- MySQL dump 10.13  Distrib 5.7.21, for macos10.13 (x86_64)
--
-- Host: rd1v6n0a3av3tek.cgeoermnrk6b.us-east-1.rds.amazonaws.com    Database: discussionfairy
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `discussion`
--

DROP TABLE IF EXISTS `discussion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discussion` (
  `updateTime` bigint(20) NOT NULL,
  `language` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `discussionId` varchar(100) NOT NULL,
  `likes` int(11) NOT NULL,
  `dislikes` int(11) NOT NULL,
  `popularity` int(11) NOT NULL,
  `discussionTitle` varchar(300) NOT NULL,
  `userId` varchar(300) NOT NULL,
  `key` varchar(300) NOT NULL,
  `comments` int(11) NOT NULL,
  `displayDiscussionId` varchar(100) DEFAULT NULL,
  `referenceLink` varchar(300) DEFAULT NULL,
  `k1` varchar(100) DEFAULT NULL,
  `k2` varchar(100) DEFAULT NULL,
  `k3` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`updateTime`,`language`,`location`,`discussionId`),
  UNIQUE KEY `discussions_discussionId_idx` (`discussionId`),
  KEY `discussions_language_idx` (`language`),
  KEY `discussions_location_idx` (`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `discussion_inbox_subscriptions`
--

DROP TABLE IF EXISTS `discussion_inbox_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discussion_inbox_subscriptions` (
  `discussionId` varchar(300) NOT NULL,
  `userId` varchar(300) NOT NULL,
  PRIMARY KEY (`discussionId`,`userId`),
  CONSTRAINT `dis-discussionId-fk` FOREIGN KEY (`discussionId`) REFERENCES `discussion` (`discussionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inbox`
--

DROP TABLE IF EXISTS `inbox`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inbox` (
  `userId` varchar(300) NOT NULL,
  `discussionId` varchar(300) NOT NULL,
  `updateTime` bigint(20) NOT NULL,
  PRIMARY KEY (`userId`,`discussionId`,`updateTime`),
  KEY `inbox-discussionId-fk_idx` (`discussionId`),
  CONSTRAINT `inbox-discussionId-fk` FOREIGN KEY (`discussionId`) REFERENCES `discussion` (`discussionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report` (
  `discussionId` varchar(300) NOT NULL,
  `userId` varchar(300) NOT NULL,
  `reportTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`discussionId`,`userId`),
  CONSTRAINT `report-discussionId-fk` FOREIGN KEY (`discussionId`) REFERENCES `discussion` (`discussionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topic` (
  `updateTime` bigint(20) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `language` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `discussionId` varchar(100) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `topic_discussionId_name_idx` (`discussionId`,`name`),
  KEY `topics_discussionId_idx` (`discussionId`),
  KEY `topics_location_idx` (`location`),
  KEY `topics_language_idx` (`language`),
  KEY `topic_search_idx` (`location`,`language`,`updateTime`),
  CONSTRAINT `topics_discussionId_fk` FOREIGN KEY (`discussionId`) REFERENCES `discussion` (`discussionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-12 21:33:25

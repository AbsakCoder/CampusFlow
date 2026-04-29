-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: campusflow_db
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blocks`
--

DROP TABLE IF EXISTS `blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blocks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocks`
--

LOCK TABLES `blocks` WRITE;
/*!40000 ALTER TABLE `blocks` DISABLE KEYS */;
INSERT INTO `blocks` VALUES (1,'CSIT Block','Computer Science & IT academic block with labs, lecture theatres and classrooms','2026-04-27 09:55:52'),(2,'K.P. Nautiyal Block','General academic block with classrooms and lecture theatres','2026-04-27 09:55:52');
/*!40000 ALTER TABLE `blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `booking_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BK-XXXX-XXXX',
  `room_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `purpose` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','approved','rejected','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `is_recurring` tinyint(1) NOT NULL DEFAULT '0',
  `recurrence_end_date` date DEFAULT NULL,
  `series_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'UUID for recurring series',
  `approved_by` int unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_booking_code` (`booking_code`),
  KEY `idx_bk_room` (`room_id`),
  KEY `idx_bk_user` (`user_id`),
  KEY `idx_bk_date` (`booking_date`),
  KEY `idx_bk_status` (`status`),
  KEY `fk_bk_approved` (`approved_by`),
  CONSTRAINT `fk_bk_approved` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bk_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'BK-A3F2-9QZ1',15,4,'2026-05-10','14:00:00','16:00:00','Workshop on Machine Learning Fundamentals','approved',0,NULL,NULL,1,'2026-04-27 10:04:18'),(2,'BK-B7K4-2MXP',10,4,'2026-05-15','10:00:00','13:00:00','Annual Tech Symposium — GEDU 2026','pending',0,NULL,NULL,NULL,'2026-04-27 10:04:18'),(3,'BK-C1R8-5NTD',12,5,'2026-05-20','09:00:00','11:00:00','Student Project Demo — Final Year Group 7','rejected',0,NULL,NULL,2,'2026-04-27 10:04:18'),(4,'BK-D4W6-8YHE',23,4,'2026-06-01','08:00:00','18:00:00','One-day Seminar on Cloud Computing','approved',0,NULL,NULL,1,'2026-04-27 10:04:18'),(5,'BK-E9J3-7VBL',18,5,'2026-06-05','13:00:00','14:00:00','Extra lab session for OS practicals','pending',0,NULL,NULL,NULL,'2026-04-27 10:04:18');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity_total` smallint NOT NULL DEFAULT '0',
  `quantity_available` smallint NOT NULL DEFAULT '0',
  `block_id` int unsigned DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_eq_block` (`block_id`),
  CONSTRAINT `fk_eq_block` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES (1,'Projector','AV Equipment',10,8,1,'Epson EB-X41 XGA projector with HDMI and VGA ports','2026-04-27 10:04:04'),(2,'Laptop','Computing',6,5,1,'Dell Latitude 5520 for presentations and lab use','2026-04-27 10:04:04'),(3,'Wireless Microphone','Audio',12,10,1,'UHF wireless mic set with receiver for seminars','2026-04-27 10:04:04'),(4,'Extension Board','Power',20,18,1,'6-socket extension boards with 5m cable','2026-04-27 10:04:04'),(5,'Whiteboard Marker','Stationery',100,85,1,'Camlin assorted colour whiteboard markers (pack of 4)','2026-04-27 10:04:04');
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment_requests`
--

DROP TABLE IF EXISTS `equipment_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment_requests` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `equipment_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `quantity_requested` smallint NOT NULL DEFAULT '1',
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `purpose` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `approved_by` int unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_eqr_equipment` (`equipment_id`),
  KEY `idx_eqr_user` (`user_id`),
  KEY `fk_eqr_approved` (`approved_by`),
  CONSTRAINT `fk_eqr_approved` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_eqr_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_eqr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment_requests`
--

LOCK TABLES `equipment_requests` WRITE;
/*!40000 ALTER TABLE `equipment_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipment_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_registrations`
--

DROP TABLE IF EXISTS `event_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_registrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `event_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `registered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_event_user` (`event_id`,`user_id`),
  KEY `idx_er_user` (`user_id`),
  CONSTRAINT `fk_er_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_er_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_registrations`
--

LOCK TABLES `event_registrations` WRITE;
/*!40000 ALTER TABLE `event_registrations` DISABLE KEYS */;
INSERT INTO `event_registrations` VALUES (1,1,5,'2026-04-27 10:04:40'),(2,2,5,'2026-04-27 10:04:40'),(3,3,5,'2026-04-27 10:04:40');
/*!40000 ALTER TABLE `event_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `venue_room_id` int unsigned DEFAULT NULL,
  `venue_text` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `organizer_id` int unsigned NOT NULL,
  `max_participants` smallint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ev_date` (`event_date`),
  KEY `idx_ev_organizer` (`organizer_id`),
  KEY `fk_ev_room` (`venue_room_id`),
  CONSTRAINT `fk_ev_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ev_room` FOREIGN KEY (`venue_room_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'TechFest 2026','Annual technical festival with coding contests, hackathons, and project exhibitions.','Festival',10,'Seminar Hall, CSIT Block','2026-03-15','09:00:00','18:00:00',1,500,'2026-04-27 10:04:31'),(2,'Workshop: Advanced Python for Data Science','Hands-on two-day workshop covering pandas, scikit-learn and deep learning basics.','Workshop',18,'Lab-4, First Floor, CSIT Block','2026-04-10','10:00:00','16:00:00',4,40,'2026-04-27 10:04:31'),(3,'Campus Placement Orientation','Orientation session for final-year students on resume building and aptitude preparation.','Placement',15,'LT-3, First Floor, CSIT Block','2026-05-05','11:00:00','13:00:00',2,300,'2026-04-27 10:04:31');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_issues`
--

DROP TABLE IF EXISTS `feedback_issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback_issues` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `room_id` int unsigned DEFAULT NULL,
  `block_id` int unsigned NOT NULL,
  `floor_id` int unsigned NOT NULL,
  `issue_type` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','in_progress','resolved') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `assigned_to` int unsigned DEFAULT NULL,
  `reported_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_fi_user` (`user_id`),
  KEY `idx_fi_room` (`room_id`),
  KEY `idx_fi_status` (`status`),
  KEY `fk_fi_block` (`block_id`),
  KEY `fk_fi_floor` (`floor_id`),
  KEY `fk_fi_assigned` (`assigned_to`),
  CONSTRAINT `fk_fi_assigned` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_fi_block` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fi_floor` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fi_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_fi_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_issues`
--

LOCK TABLES `feedback_issues` WRITE;
/*!40000 ALTER TABLE `feedback_issues` DISABLE KEYS */;
INSERT INTO `feedback_issues` VALUES (1,5,8,1,2,'AC Malfunction','The air conditioner in LT-1 (Ground Floor, CSIT) has not been working since Monday. Temperature is very uncomfortable during afternoon sessions.','in_progress',1,'2026-04-27 10:05:49',NULL),(2,4,7,1,2,'Projector Issue','Projector bulb in CR-3 is completely out. Classes relying on slides are being disrupted. Urgent replacement needed.','pending',NULL,'2026-04-27 10:05:49',NULL),(3,5,3,1,1,'WiFi Not Working','WiFi access point in Lab-2 (Basement) dropped connection on Wednesday and has not recovered. Lab sessions are impacted.','pending',NULL,'2026-04-27 10:05:49',NULL),(4,5,35,2,7,'Furniture Damage','Three chairs in KPN CR-2 (First Floor) are broken and pose a safety risk. Students are avoiding them but the room needs attention.','resolved',2,'2026-04-27 10:05:49','2026-04-20 10:00:00'),(5,4,23,1,4,'Electrical Issue','Tube lights in LT-6 (Second Floor, CSIT) keep flickering during lectures. This is causing eye strain and disruptions.','in_progress',3,'2026-04-27 10:05:49',NULL);
/*!40000 ALTER TABLE `feedback_issues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `floors` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `block_id` int unsigned NOT NULL,
  `floor_name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor_number` tinyint NOT NULL COMMENT '-1=Basement, 0=Ground, 1=First …',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_block` (`block_id`),
  CONSTRAINT `fk_floors_block` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floors`
--

LOCK TABLES `floors` WRITE;
/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
INSERT INTO `floors` VALUES (1,1,'Basement',-1,'2026-04-27 09:56:01'),(2,1,'Ground Floor',0,'2026-04-27 09:56:01'),(3,1,'First Floor',1,'2026-04-27 09:56:01'),(4,1,'Second Floor',2,'2026-04-27 09:56:01'),(5,1,'Third Floor',3,'2026-04-27 09:56:01'),(6,2,'Ground Floor',0,'2026-04-27 09:56:01'),(7,2,'First Floor',1,'2026-04-27 09:56:01'),(8,2,'Second Floor',2,'2026-04-27 09:56:01');
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lost_found`
--

DROP TABLE IF EXISTS `lost_found`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lost_found` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `item_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `location_found` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('lost','found') COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','claimed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_lf_user` (`user_id`),
  KEY `idx_lf_type` (`type`),
  KEY `idx_lf_status` (`status`),
  CONSTRAINT `fk_lf_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lost_found`
--

LOCK TABLES `lost_found` WRITE;
/*!40000 ALTER TABLE `lost_found` DISABLE KEYS */;
/*!40000 ALTER TABLE `lost_found` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `floor_id` int unsigned NOT NULL,
  `block_id` int unsigned NOT NULL,
  `room_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g. CSIT-CR3',
  `room_name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_type` enum('CR','LT','Lab','Seminar Hall','Office') COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` smallint NOT NULL DEFAULT '0',
  `hasAC` tinyint(1) NOT NULL DEFAULT '1',
  `hasProjector` tinyint(1) NOT NULL DEFAULT '1',
  `hasWifi` tinyint(1) NOT NULL DEFAULT '1',
  `status` enum('free','occupied','booked') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'free',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_room_code` (`room_code`),
  KEY `idx_room_floor` (`floor_id`),
  KEY `idx_room_block` (`block_id`),
  KEY `idx_room_status` (`status`),
  CONSTRAINT `fk_rooms_block` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rooms_floor` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,1,1,'CSIT-OFFICE','Office','Office',30,1,1,1,'free','2026-04-27 09:57:42'),(2,1,1,'CSIT-LAB1','Lab-1','Lab',100,1,1,1,'free','2026-04-27 09:57:42'),(3,1,1,'CSIT-LAB2','Lab-2','Lab',100,1,1,1,'free','2026-04-27 09:57:42'),(4,1,1,'CSIT-LAB3','Lab-3','Lab',100,1,1,1,'free','2026-04-27 09:57:42'),(5,2,1,'CSIT-CR1','CR-1','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(6,2,1,'CSIT-CR2','CR-2','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(7,2,1,'CSIT-CR3','CR-3','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(8,2,1,'CSIT-LT1','LT-1','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(9,2,1,'CSIT-LT2','LT-2','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(10,2,1,'CSIT-SH','Seminar Hall','Seminar Hall',300,1,1,1,'free','2026-04-27 09:57:42'),(11,3,1,'CSIT-CR4','CR-4','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(12,3,1,'CSIT-CR5','CR-5','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(13,3,1,'CSIT-CR6','CR-6','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(14,3,1,'CSIT-CR7','CR-7','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(15,3,1,'CSIT-LT3','LT-3','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(16,3,1,'CSIT-LT4','LT-4','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(17,3,1,'CSIT-LT5','LT-5','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(18,3,1,'CSIT-LAB4','Lab-4','Lab',50,1,1,1,'free','2026-04-27 09:57:42'),(19,3,1,'CSIT-LAB5','Lab-5','Lab',50,1,1,1,'free','2026-04-27 09:57:42'),(20,4,1,'CSIT-CR8','CR-8','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(21,4,1,'CSIT-CR9','CR-9','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(22,4,1,'CSIT-CR10','CR-10','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(23,4,1,'CSIT-LT6','LT-6','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(24,4,1,'CSIT-LT7','LT-7','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(25,4,1,'CSIT-LT8','LT-8','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(26,4,1,'CSIT-LAB6','Lab-6','Lab',65,1,1,1,'free','2026-04-27 09:57:42'),(27,4,1,'CSIT-LAB7','Lab-7','Lab',65,1,1,1,'free','2026-04-27 09:57:42'),(28,5,1,'CSIT-CR11','CR-11','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(29,5,1,'CSIT-CR12','CR-12','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(30,5,1,'CSIT-LT9','LT-9','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(31,5,1,'CSIT-LT10','LT-10','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(32,5,1,'CSIT-LT11','LT-11','LT',300,1,1,1,'free','2026-04-27 09:57:42'),(33,6,2,'KPN-CR1','CR-1','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(34,6,2,'KPN-LT1','LT-1','LT',100,1,1,1,'free','2026-04-27 09:57:42'),(35,7,2,'KPN-CR2','CR-2','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(36,7,2,'KPN-CR3','CR-3','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(37,7,2,'KPN-CR4','CR-4','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(38,7,2,'KPN-LT2','LT-2','LT',100,1,1,1,'free','2026-04-27 09:57:42'),(39,8,2,'KPN-CR5','CR-5','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(40,8,2,'KPN-CR6','CR-6','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(41,8,2,'KPN-CR7','CR-7','CR',100,1,1,1,'free','2026-04-27 09:57:42'),(42,8,2,'KPN-LT3','LT-3','LT',100,1,1,1,'free','2026-04-27 09:57:42');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `rooms_view`
--

DROP TABLE IF EXISTS `rooms_view`;
/*!50001 DROP VIEW IF EXISTS `rooms_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `rooms_view` AS SELECT 
 1 AS `room_id`,
 1 AS `room_code`,
 1 AS `room_name`,
 1 AS `room_type`,
 1 AS `capacity`,
 1 AS `hasAC`,
 1 AS `hasProjector`,
 1 AS `hasWifi`,
 1 AS `room_status`,
 1 AS `floor_id`,
 1 AS `floor_name`,
 1 AS `floor_number`,
 1 AS `block_id`,
 1 AS `block_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `timetable_entries`
--

DROP TABLE IF EXISTS `timetable_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetable_entries` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `room_id` int unsigned NOT NULL,
  `subject_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'A / B / C / General',
  `day_of_week` enum('Mon','Tue','Wed','Thu','Fri','Sat','Sun') COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `academic_year` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '2025-26',
  `effective_from` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slot` (`room_id`,`day_of_week`,`start_time`),
  KEY `idx_tt_room` (`room_id`),
  KEY `idx_tt_day` (`day_of_week`),
  KEY `idx_tt_section` (`section`),
  CONSTRAINT `fk_tt_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable_entries`
--

LOCK TABLES `timetable_entries` WRITE;
/*!40000 ALTER TABLE `timetable_entries` DISABLE KEYS */;
INSERT INTO `timetable_entries` VALUES (64,9,'TCS-409','A','Tue','09:55:00','10:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(65,7,'TCS-408','A','Tue','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(66,8,'TCS-402','A','Tue','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(67,7,'TCS-408','A','Wed','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(68,8,'TCS-402','A','Wed','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(69,3,'PCS-409-Lab','A','Thu','08:00:00','08:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(70,9,'TCS-409','A','Thu','09:55:00','10:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(71,7,'TCS-408','A','Thu','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(72,8,'TCS-402','A','Thu','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(73,7,'TCS-408','A','Fri','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(74,8,'TCS-402','A','Fri','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(75,23,'Career-Skills','A','Sat','08:00:00','08:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(76,17,'TCS-403','A','Sat','09:00:00','09:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(77,2,'Microprocessors-Lab','A','Sat','09:55:00','10:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(78,9,'TCS-421','A','Sat','12:05:00','13:00:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(79,8,'TCS-408','B','Mon','09:55:00','10:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(80,8,'TCS-402','B','Mon','12:05:00','13:00:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(81,24,'TCS-402','B','Tue','09:00:00','09:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(82,8,'TCS-403','B','Tue','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(83,8,'TCS-409','B','Tue','13:55:00','14:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(84,2,'Microprocessors-Lab','B','Tue','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(85,24,'TOC-401','B','Wed','08:00:00','08:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(86,8,'TCS-408','B','Wed','09:55:00','10:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(87,8,'TCS-402','B','Wed','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(88,2,'PCS-409-Lab','B','Wed','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(89,8,'TCS-408','B','Thu','09:55:00','10:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(90,8,'TCS-402','B','Thu','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(91,8,'TCS-409','B','Thu','13:55:00','14:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(92,2,'Microprocessors-Lab','B','Thu','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(93,8,'TCS-408','B','Fri','09:55:00','10:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(94,8,'TCS-409','B','Fri','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(95,8,'TCS-403','B','Sat','09:55:00','10:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(96,8,'TCS-403','B','Sat','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(97,2,'PCS-409-Lab','B','Sat','13:55:00','14:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(98,8,'TCS-409','B','Sat','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(99,9,'TCS-402','C','Mon','09:55:00','10:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(100,9,'TCS-464','C','Mon','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(101,2,'PCS-409-Lab','C','Tue','08:00:00','08:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(102,15,'TOC-401','C','Tue','13:55:00','14:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(103,9,'TCS-403','C','Tue','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(104,14,'TCS-403','C','Wed','09:00:00','09:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(105,14,'TCS-403','C','Thu','08:00:00','08:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(106,25,'TCS-464','C','Thu','09:00:00','09:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(107,8,'TOC-401','C','Fri','08:00:00','08:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(108,17,'TCS-464','C','Fri','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(109,30,'TCS-402','C','Fri','13:55:00','14:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(110,2,'PCS-409-Lab','C','Sat','08:00:00','08:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(111,9,'TCS-403','C','Sat','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(112,13,'TCS-408','General','Mon','08:00:00','08:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(113,13,'TCS-409','General','Mon','09:00:00','09:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(114,7,'TCS-408','General','Tue','08:00:00','08:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(115,7,'TCS-409','General','Tue','09:00:00','09:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(116,11,'TCS-403','General','Tue','11:10:00','12:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(117,7,'TCS-403','General','Wed','13:55:00','14:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(118,21,'TCS-408','General','Wed','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(119,23,'TCS-402','General','Thu','09:00:00','09:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(120,20,'TCS-403','General','Thu','13:55:00','14:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(121,9,'TCS-409','General','Thu','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(122,6,'TOC-401','General','Thu','16:05:00','17:00:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(123,7,'TCS-408','General','Fri','08:00:00','08:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(124,7,'TCS-403','General','Fri','09:00:00','09:55:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(125,17,'TCS-409','General','Fri','09:55:00','10:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(126,17,'TCS-402','General','Fri','13:55:00','14:50:00','2025-26','2026-01-05','2026-04-27 10:03:43'),(127,27,'PCS-409-Lab','General','Fri','15:10:00','16:05:00','2025-26','2026-01-05','2026-04-27 10:03:43');
/*!40000 ALTER TABLE `timetable_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SHA2-256 hex',
  `role` enum('admin','faculty','student') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `enrollment_no` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Students only',
  `employee_id` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Faculty / Admin only',
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Abhishek Upadhyay','abhishek@campusflow.com','e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7','admin',NULL,'EMP-001','Computer Science','2026-04-27 09:55:38'),(2,'Krishika Duggal','krishika@campusflow.com','e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7','admin',NULL,'EMP-002','Computer Science','2026-04-27 09:55:38'),(3,'Dhruv Pandey','dhruv@campusflow.com','e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7','admin',NULL,'EMP-003','Computer Science','2026-04-27 09:55:38'),(4,'Dr. Priya Sharma','faculty@campusflow.com','9859bcef2187144a16f11447b17129443780817a119496650b96bf354a65739e','faculty',NULL,'EMP-004','Computer Science','2026-04-27 09:55:38'),(5,'Dhruv Mehta','student@campusflow.com','b2a1f4fd0a460606b34c8913e2981dac8d2e283d778aba586c416ee2629bfa54','student','ENR-2022-001',NULL,'Computer Science (AI & DS)','2026-04-27 09:55:38');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `rooms_view`
--

/*!50001 DROP VIEW IF EXISTS `rooms_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `rooms_view` AS select `r`.`id` AS `room_id`,`r`.`room_code` AS `room_code`,`r`.`room_name` AS `room_name`,`r`.`room_type` AS `room_type`,`r`.`capacity` AS `capacity`,`r`.`hasAC` AS `hasAC`,`r`.`hasProjector` AS `hasProjector`,`r`.`hasWifi` AS `hasWifi`,`r`.`status` AS `room_status`,`f`.`id` AS `floor_id`,`f`.`floor_name` AS `floor_name`,`f`.`floor_number` AS `floor_number`,`b`.`id` AS `block_id`,`b`.`name` AS `block_name` from ((`rooms` `r` join `floors` `f` on((`r`.`floor_id` = `f`.`id`))) join `blocks` `b` on((`r`.`block_id` = `b`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-28 21:35:35

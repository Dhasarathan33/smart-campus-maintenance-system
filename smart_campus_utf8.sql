-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: smart_campus_maintenance
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_departments`
--

DROP TABLE IF EXISTS `academic_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_departments` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `department_name` (`department_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_departments`
--

LOCK TABLES `academic_departments` WRITE;
/*!40000 ALTER TABLE `academic_departments` DISABLE KEYS */;
INSERT INTO `academic_departments` VALUES (1,'AI&DS'),(7,'CIVIL'),(2,'CSE'),(4,'ECE'),(5,'EEE'),(3,'IT'),(8,'MBA'),(6,'MECH');
/*!40000 ALTER TABLE `academic_departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `complaint_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `department_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(150) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Assigned','In Progress','Awaiting Verification','Completed') DEFAULT 'Pending',
  `technician_id` int DEFAULT NULL,
  `repair_notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` datetime DEFAULT NULL,
  `priority` enum('High','Medium','Low') DEFAULT 'Low',
  `assigned_at` datetime DEFAULT NULL,
  `started_at` datetime DEFAULT NULL,
  `completion_submitted_at` datetime DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `verified_by` int DEFAULT NULL,
  `verification_notes` text,
  PRIMARY KEY (`complaint_id`),
  KEY `user_id` (`user_id`),
  KEY `department_id` (`department_id`),
  KEY `technician_id` (`technician_id`),
  KEY `fk_complaints_verified_by` (`verified_by`),
  CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `complaints_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`),
  CONSTRAINT `complaints_ibfk_3` FOREIGN KEY (`technician_id`) REFERENCES `technicians` (`technician_id`),
  CONSTRAINT `fk_complaints_verified_by` FOREIGN KEY (`verified_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES (2,7,2,'water leakage','water leakage in restroom ','as block  1st floor',NULL,'Completed',4,'done','2026-08-06 05:45:48','2026-08-06 06:43:42','2026-08-06 12:13:42','Low',NULL,NULL,NULL,NULL,NULL,NULL),(3,7,3,'Projector ','projector will not work','Sf Block IT Lab-1',NULL,'Completed',5,'done','2026-08-07 15:54:34','2026-08-08 04:14:20','2026-08-08 09:44:20','Medium','2026-08-08 09:24:13','2026-08-08 09:44:16',NULL,NULL,NULL,NULL),(4,7,1,'Light ','light blinking','IB Block First Floor',NULL,'Assigned',2,NULL,'2026-08-08 04:04:30','2026-08-12 15:38:43',NULL,'Low','2026-08-08 09:34:54',NULL,NULL,NULL,NULL,NULL),(5,7,1,'Electrical short circuit','Sparks coming from an electrical switchboard in a classroom.','SF Block First Floor',NULL,'Completed',2,'rectify the issue','2026-08-08 06:10:49','2026-08-08 06:12:36','2026-08-08 11:42:36','High','2026-08-08 11:41:11','2026-08-08 11:41:32','2026-08-08 11:42:14','2026-08-08 11:42:36',1,NULL),(6,7,1,'light ','light dimming','Sf Block',NULL,'Completed',2,'done the issue','2026-08-08 06:14:30','2026-08-08 06:15:36','2026-08-08 11:45:36','Low','2026-08-08 11:44:47','2026-08-08 11:45:23',NULL,NULL,NULL,NULL),(7,7,3,'Projector','Projector will not work correctly','Sf Block IT Lab 1',NULL,'In Progress',5,'rectify the issues','2026-08-12 15:04:12','2026-08-12 15:24:07',NULL,'Low','2026-08-12 20:41:35','2026-08-12 20:53:49',NULL,NULL,NULL,NULL),(8,7,1,'Shrt circiut','shrt','Ib Block',NULL,'Completed',2,'Done','2026-08-12 15:31:53','2026-08-12 15:33:47','2026-08-12 21:03:47','High','2026-08-12 21:02:19','2026-08-12 21:03:00','2026-08-12 21:03:16','2026-08-12 21:03:47',1,NULL),(9,10,3,'Software ','Softwer is not installed','It Lab 3 (SF Block)',NULL,'In Progress',5,NULL,'2026-08-12 15:53:07','2026-08-12 15:54:20',NULL,'Low','2026-08-12 21:23:32','2026-08-12 21:24:20',NULL,NULL,NULL,NULL),(10,10,1,'light','light not working','Sf Block IT lab-1','https://images.unsplash.com/photo-1562774053-701939374585','Assigned',2,NULL,'2026-08-19 07:56:07','2026-08-19 07:56:53',NULL,'Low','2026-08-19 13:26:53',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Electrical'),(2,'Plumbing'),(3,'Technical');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `complaint_id` int DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  KEY `complaint_id` (`complaint_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,7,'New complaint #7 requires your attention.','info',1,'2026-08-12 15:04:12'),(4,9,7,'Complaint #7 has been assigned to you.','assignment',1,'2026-08-12 15:23:16'),(6,1,8,'New complaint #8 requires your attention.','info',1,'2026-08-12 15:31:53'),(7,5,8,'Complaint #8 has been assigned to you.','assignment',1,'2026-08-12 15:32:19'),(8,7,8,'Technician has started working on Complaint #8.','status',1,'2026-08-12 15:33:00'),(11,1,9,'New complaint #9 requires your attention.','info',1,'2026-08-12 15:53:07'),(12,9,9,'Complaint #9 has been assigned to you.','assignment',1,'2026-08-12 15:53:32'),(13,10,9,'Technician has started working on Complaint #9.','status',1,'2026-08-12 15:54:21'),(14,1,10,'New complaint #10 requires your attention.','info',0,'2026-08-19 07:56:07'),(15,5,10,'Complaint #10 has been assigned to you.','assignment',0,'2026-08-19 07:56:53');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `technicians`
--

DROP TABLE IF EXISTS `technicians`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `technicians` (
  `technician_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `department_id` int NOT NULL,
  PRIMARY KEY (`technician_id`),
  KEY `user_id` (`user_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `technicians_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `technicians_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `technicians`
--

LOCK TABLES `technicians` WRITE;
/*!40000 ALTER TABLE `technicians` DISABLE KEYS */;
INSERT INTO `technicians` VALUES (2,5,1),(3,6,1),(4,8,2),(5,9,3);
/*!40000 ALTER TABLE `technicians` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `college_email` varchar(100) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Student','Staff','Technician','Admin') NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `department_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `college_email` (`college_email`),
  KEY `fk_users_academic_department` (`department_id`),
  CONSTRAINT `fk_users_academic_department` FOREIGN KEY (`department_id`) REFERENCES `academic_departments` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@bitsathy.ac.in',NULL,'$2b$10$4jLyLoeuYfvL40RfFVjEpuynqjTCToLPJIXKu7k0tbojuA.NzyK.u','Admin','Administration','2026-08-04 15:41:13',NULL),(3,'Priya','priya.staff@bitsathy.ac.in',NULL,'$2b$10$4jLyLoeuYfvL40RfFVjEpuynqjTCToLPJIXKu7k0tbojuA.NzyK.u','Staff','Computer Science and Engineering','2026-08-04 16:16:51',NULL),(5,'Ravi Kumar','ravi@bitsathy.ac.in','9876543210','$2b$10$QIEzKS5wLit2J5QwY2j05OSW9Zh9bhcmrON0eex8NXnJ0o6X09m..','Technician',NULL,'2026-08-05 09:39:19',NULL),(6,'Test Technician','testtech@bitsathy.ac.in','9876543210','$2b$10$2yNpXCgDYxS0awQx.ftSF.f8EzjJ6Bu.A0egtW1jvhkc20/nrABgK','Technician',NULL,'2026-08-05 14:56:08',NULL),(7,'jivi','jivi@bitsathy.ac.in','9080165838','$2b$10$nVBIvrm0sVms38INjevided6eZwpnDEOj9Z3NUJJE6m..KC71/Zb.','Student',NULL,'2026-08-05 16:47:13',1),(8,'jai akash','jaiakash.plum@bitsathy.ac.in','9018378032','$2b$10$MVugnPEWneDtuOxU.JZq3./9A1hiFaF6o2r.l4GuNVMY7Nrv0Fuiy','Technician',NULL,'2026-08-06 06:21:30',NULL),(9,'RK','rk.tech@bitsathy.ac.in','8090123456','$2b$10$hd/CgWLQU9F6ipowi.WIoewzmsXmlj/JJ7a8rkfk2Wt0Nm1C2DREK','Technician',NULL,'2026-08-07 16:03:27',NULL),(10,'dhass','dhasarathan.ad23@bitsathy.ac.in','8807773809','$2b$10$/XUFB7qIY8JTqA.HXChW1uwblj3pY6AzAJrqJteKCZimL/MOR2ldy','Student',NULL,'2026-08-12 15:38:01',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-19 21:21:35

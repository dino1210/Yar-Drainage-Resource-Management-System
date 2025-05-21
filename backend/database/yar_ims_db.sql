-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 03:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yar_ims_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(255) NOT NULL,
  `category_type` varchar(255) NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_type`, `category_name`) VALUES
(1, 'Tools And Equipment', 'Angle Grinder'),
(2, 'Tools and Equipments', 'Welding Machine'),
(3, 'Vehicle', 'Truck');

-- --------------------------------------------------------

--
-- Table structure for table `consumables`
--

CREATE TABLE `consumables` (
  `consumable_id` int(11) NOT NULL,
  `picture` varchar(255) NOT NULL,
  `tag` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `minStock` int(11) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'In Stock',
  `qr` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consumables`
--

INSERT INTO `consumables` (`consumable_id`, `picture`, `tag`, `name`, `quantity`, `minStock`, `unit`, `location`, `date`, `status`, `qr`, `category`) VALUES
(1, '1745822603388-364008207.jpg', ' DISC-002', 'Cutting Disc 4\" 2.5mm', 14, 20, 'pcs', ' Rack 3-Drawer 11', '2025-04-28', 'Low Stock', '', ' Cutting Disk'),
(2, '1745822713321-485494957.jpg', ' DBIT-006', ' Drill Bit Steel 1/2', 96, 3, 'pcs', ' Rack 3-Drawer 17', '2025-04-28', 'In Stock', '', ' Drill Bit'),
(3, '1745822960475-604811994.jpg', ' WROD-00', ' Welding Rod N-6011', 9, 25, 'kg', ' Rack 3-Drawer 15', '2025-04-28', 'In Stock', '', ' Welding Rod'),
(4, '1745823073022-335597718.jpg', ' CLMP-006', ' Metal Clamp 2\" 2 Holes Fab', 96, 5, 'pcs', 'Rcabinet-Drawer 3', '2025-04-28', 'In Stock', '', ' Metal Clamp'),
(5, '1745823211823-557831080.jpg', ' NAIL-009', ' Concrete Nail 1 1/2\"', 100, 5, 'kg', 'BCabinet-Drawer 8', '2025-04-28', 'In Stock', '', ' Nail');

--
-- Triggers `consumables`
--
DELIMITER $$
CREATE TRIGGER `update_consumables_status` BEFORE INSERT ON `consumables` FOR EACH ROW BEGIN
  IF NEW.quantity = 0 THEN
    SET NEW.status = 'No Stock';
  ELSEIF NEW.quantity < NEW.minStock THEN
    SET NEW.status = 'Low Stock';
  ELSE
    SET NEW.status = 'In Stock';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_consumables_status_on_update` BEFORE UPDATE ON `consumables` FOR EACH ROW BEGIN
  IF NEW.quantity = 0 THEN
    SET NEW.status = 'No Stock';
  ELSEIF NEW.quantity < NEW.minStock THEN
    SET NEW.status = 'Low Stock';
  ELSE
    SET NEW.status = 'In Stock';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `consumables_logs`
--

CREATE TABLE `consumables_logs` (
  `id` int(11) NOT NULL,
  `consumable_name` varchar(255) NOT NULL,
  `performed_by` varchar(255) NOT NULL,
  `issued_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consumables_logs`
--

INSERT INTO `consumables_logs` (`id`, `consumable_name`, `performed_by`, `issued_date`, `status`) VALUES
(47, ' Drill Bit Steel 1/2', 'NOBODY', '2025-05-02 00:22:36', 'Issued Out'),
(48, ' Metal Clamp 2\" 2 Holes Fab', 'NOBODY', '2025-05-02 00:22:36', 'Issued Out'),
(49, 'Drill Bit Steel 1/2', 'NOBODY', '2025-05-02 00:23:08', 'Returned'),
(50, 'Metal Clamp 2\" 2 Holes Fab', 'NOBODY', '2025-05-02 00:23:08', 'Returned'),
(51, ' Drill Bit Steel 1/2', 'hello', '2025-05-02 00:26:35', 'Returned'),
(52, 'Drill Bit Steel 1/2', 'hello', '2025-05-02 00:26:42', 'Returned'),
(53, 'Cutting Disc 4\" 2.5mm', 'sample', '2025-05-02 00:32:08', 'Returned');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `person_in_charge` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) NOT NULL,
  `project_status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `name`, `person_in_charge`, `location`, `description`, `start_date`, `end_date`, `created_at`, `created_by`, `project_status`) VALUES
(162, 'Mang Inasal Edsa Branch', 'Angelo Padilla', '2nd Floor Empire Mall Edsa Cor, Taft Ave, Pasay', 'A clogged underground drain was causing surface flooding in the client’s backyard. We excavated, cleared debris, and re-sloped the pipe to restore proper water flow.', '2025-05-19', '2025-05-29', '2025-05-08 02:39:45', 'Admin', 'Upcoming'),
(163, 'Delsan Corporate Center', 'Jestro Maverick De Castro', 'Upper Ground Floor, Ayala Malls Circuit, Hippodromo, Makati, 1203 Metro Manila', 'The existing drainage system at a commercial site was unable to handle runoff, leading to water pooling near the foundation. We installed larger pipes and added surface drains to improve capacity and redirect water safely.', '2025-05-07', '2025-05-19', '2025-05-08 02:41:38', 'Admin', 'Extended'),
(164, 'Wilcon Depot Main Branch Pasig', 'Edan Fher Raymundo', ' #90 Eulogio Rodriguez Jr. Ave, Murphy, Quezon City, 1110 Metro Manila', 'Erosion and sediment buildup had reduced the effectiveness of a roadside ditch. The ditch was reshaped, lined with gravel, and reinforced to handle runoff without flooding nearby properties.', '2025-05-14', '2025-05-19', '2025-05-08 02:43:36', 'Admin', 'Cancelled'),
(165, 'SM Manila', 'Ronald J Labrado Jr.', 'HXRM+4G2, Natividad Almeda-Lopez corner A. Villegas and, San Marcelino St, Ermita, Manila, Metro Manila', 'Water was leaking into the basement due to poor downspout drainage. We extended and redirected the downspouts away from the house and graded the soil to promote better runoff.', '2025-05-07', '2025-05-19', '2025-05-08 02:45:38', 'Admin', 'Extended'),
(173, 'Ronalad Nigg', 'g fjk', 'vjnkl', 'bhnjk', '2025-05-22', '2025-05-29', '2025-05-08 06:29:30', 'Admin', 'Upcoming'),
(174, 'fithuj.l', 'lgujlk', 'kvkjm', 'ykl', '2025-05-07', '2025-05-20', '2025-05-08 06:42:51', 'Admin', 'Completed'),
(175, 'TUP Manila ', 'Test', '8vbihnojim vygbhnjmlk', 'vygbihnujm', '2025-05-19', '2025-05-29', '2025-05-19 15:26:13', 'Admin', 'Completed'),
(176, 'GHjknmdu', 'vubhjnkm', 'ubhjnm`blhjknm', 'ubhlnjkm ,', '2025-05-19', '2025-05-28', '2025-05-20 02:06:58', 'Admin', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `project_consumables`
--

CREATE TABLE `project_consumables` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `consumable_id` int(11) NOT NULL,
  `allocated_quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_consumables`
--

INSERT INTO `project_consumables` (`id`, `project_id`, `consumable_id`, `allocated_quantity`) VALUES
(20, 162, 1, 1),
(21, 163, 1, 1),
(22, 164, 2, 1),
(23, 165, 4, 1),
(24, 173, 4, 1),
(25, 174, 1, 1),
(26, 175, 1, 1),
(27, 175, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_tools`
--

CREATE TABLE `project_tools` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `tool_id` int(11) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_tools`
--

INSERT INTO `project_tools` (`id`, `project_id`, `tool_id`, `created_at`) VALUES
(87, 162, 2, '2025-05-08'),
(88, 163, 3, '2025-05-08'),
(89, 164, 4, '2025-05-08'),
(90, 165, 5, '2025-05-08'),
(96, 173, 28, '2025-05-08'),
(97, 174, 25, '2025-05-08'),
(98, 175, 29, '2025-05-19'),
(99, 175, 30, '2025-05-19'),
(100, 175, 31, '2025-05-19'),
(101, 176, 23, '2025-05-20'),
(102, 176, 25, '2025-05-20'),
(103, 176, 30, '2025-05-20');

-- --------------------------------------------------------

--
-- Table structure for table `project_vehicles`
--

CREATE TABLE `project_vehicles` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_vehicles`
--

INSERT INTO `project_vehicles` (`id`, `project_id`, `vehicle_id`, `created_at`) VALUES
(32, 162, 5, '2025-05-08 02:39:46'),
(33, 163, 17, '2025-05-08 02:41:39'),
(34, 164, 1, '2025-05-08 02:43:36'),
(35, 165, 3, '2025-05-08 02:45:39'),
(36, 173, 1, '2025-05-08 06:29:30'),
(37, 175, 18, '2025-05-19 15:26:15');

-- --------------------------------------------------------

--
-- Table structure for table `tools`
--

CREATE TABLE `tools` (
  `tool_id` int(11) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `tag` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `warranty` date DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Available',
  `remarks` text DEFAULT NULL,
  `qr` mediumtext DEFAULT NULL,
  `qr_code_id` varchar(255) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tools`
--

INSERT INTO `tools` (`tool_id`, `picture`, `name`, `brand`, `category`, `tag`, `description`, `purchase_date`, `warranty`, `status`, `remarks`, `qr`, `qr_code_id`, `created_at`, `created_by`) VALUES
(1, '1745821307732-503816072.jpg', 'Contender Welding Machine', 'Contender', 'Welding Machine', 'POWER-WLDGM_CONTNDR-1', 'Input Voltage, 220. Maximum Rod Diameter, 4.0 mm. Rated Input Capacity, 10.2', '2025-03-31', '2026-04-27', 'Available', 'Brand New', 'TOOL-312edc10-82b0-4500-8683-a031996e18f4.png', 'TOOL-312edc10-82b0-4500-8683-a031996e18f4', '0000-00-00', ''),
(2, '1745821628548-538938628.jpg', 'Dartek Angle Grinder', 'Dartek', 'Angle Grinder', 'POWER-ANGLGRNDR_DARTEK-1', 'Rated Input Power, 760W. No-Load Speed, 11500r/min. Max Wheel Diameter, 100mm. Hole Diameter of Wheel, 16mm.', '2025-03-31', '2025-04-24', 'Available', 'Brand New', 'TOOL-cadb0389-23f2-4702-a5a8-1ece4decfc9c.png', 'TOOL-cadb0389-23f2-4702-a5a8-1ece4decfc9c', '0000-00-00', ''),
(3, '1745821790372-377372672.jpg', 'Megaman Floodlight ', 'Megaman', 'Light', 'POWER-FLDLIGHT_MGMN-1', '0W 840 IP66 IK08. 711433 ; FL TITO 90W 840 IP66 IK08. 710825 ; FL TITO 120W 840 IP66 IK08.', '2025-04-01', '2049-04-13', 'Available', 'Brand New', 'TOOL-ce29f0eb-2fe7-4bba-be16-f3ee03e7dd21.png', 'TOOL-ce29f0eb-2fe7-4bba-be16-f3ee03e7dd21', '0000-00-00', ''),
(4, '1745821991819-726796547.jpg', 'Makita Nail Gun', 'Makita', 'Nail Gun', 'POWER-NAILGUN_MKTA-1', 'Nail size capacity: 10-50mm (19/32\"-2\") Nail type: F15-F50 Gauge: 18 Operating pressure: 60-100psi', '2025-03-31', '2027-04-07', 'Available', 'Brand New', 'TOOL-344ede88-66df-4571-adca-79450032c487.png', 'TOOL-344ede88-66df-4571-adca-79450032c487', '0000-00-00', ''),
(5, '1745822173903-752629888.jpg', 'Welding Mask', 'Generic', 'Welding Mask', 'OTHERS-WLDGMASK-1', 'equipped with #12 Dark Glass for safety', '2025-03-31', '2025-04-08', 'Available', 'Brand New', 'TOOL-4b262466-e3ba-40b2-ae32-1418627ce760.png', 'TOOL-4b262466-e3ba-40b2-ae32-1418627ce760', '0000-00-00', ''),
(21, '1746663301961-669941794.jpg', 'TEST', 'TEST', 'TEST', 'cfvgbknm', 'hjnkm,', '2025-05-05', '2025-05-22', 'Available', 'vgkbjkn,', 'TOOL-b998a88d-5553-4560-a551-756ebb7c1dcb.png', 'TOOL-b998a88d-5553-4560-a551-756ebb7c1dcb', '2025-05-08', 'Admin'),
(22, '1746663657159-122363514.jpg', 'ADDED', 'tvuygbhnj', 'gbhknj', 'tygbhunj', 'ftgybhnjk', '2025-05-04', '2025-05-06', 'Available', 'gbjnk', 'TOOL-a779d992-fc25-4a26-ab1b-d87894d60d06.png', 'TOOL-a779d992-fc25-4a26-ab1b-d87894d60d06', '2025-05-08', 'Admin'),
(23, '1746663728291-274718159.jpg', 'NEWYVGBIHNKJ', 'ygbihnujmk', 'ygbihunjk', 'gbhunjmk', 'yuijmkl', '2025-05-07', '2025-05-14', 'Available', 'j km,', 'TOOL-eadcc17d-0b1f-4a6c-9e97-07a9444e2d9a.png', 'TOOL-eadcc17d-0b1f-4a6c-9e97-07a9444e2d9a', '2025-05-08', 'Admin'),
(24, '1746667714331-503937939.jpg', 'HAHAHAHA', 'gybhn', 'gbhnj', 'gbhkj', 'fgbhjk', '2025-05-06', '2025-05-06', 'Available', 'buhnljkm', 'TOOL-862b4e41-d6fb-4e0d-83dc-0256303ab204.png', 'TOOL-862b4e41-d6fb-4e0d-83dc-0256303ab204', '2025-05-08', 'Admin'),
(25, '1746668030330-269326750.jpg', 'kbjnm', 'bhnjkm', 'kbhnkj', 'hblnjk', 'bhnkjm', '2025-04-30', '2025-05-21', 'Available', 'vbnjkl', 'TOOL-fd27535a-e742-419e-afa5-49d76f9f79aa.png', 'TOOL-fd27535a-e742-419e-afa5-49d76f9f79aa', '2025-05-08', 'Admin'),
(26, '1746670931294-658023997.jpg', 'TEST TAG', 'vuygbhnj', 'ygbihunj', 'vuygbhnj', 'tgyiuhnjm', '2025-04-27', '2025-05-20', 'Available', 'knjm,.', 'TOOL-5975f526-d249-4767-93d3-0b91d0daa802.png', 'TOOL-5975f526-d249-4767-93d3-0b91d0daa802', '2025-05-08', 'Admin'),
(27, '1746670941254-520737998.jpg', 'TEST TAG', 'vuygbhnj', 'ygbihunj', 'vuygbhnj', 'tgyiuhnjm', '2025-04-27', '2025-05-20', 'Available', 'knjm,.', 'TOOL-f6a0c1a8-85b1-4a07-8bb6-f4a1a407294e.png', 'TOOL-f6a0c1a8-85b1-4a07-8bb6-f4a1a407294e', '2025-05-08', 'Admin'),
(28, '1746670967066-391528828.jpg', 'TEST TAG', 'vuygbhnj', 'ygbihunj', 'vuygbhnj', 'tgyiuhnjm', '2025-04-27', '2025-05-20', 'Available', 'knjm,.', 'TOOL-d3281ab6-96f9-466f-8ff0-b7538678cfad.png', 'TOOL-d3281ab6-96f9-466f-8ff0-b7538678cfad', '2025-05-08', 'Admin'),
(29, '1747654747313-321135707.png', 'TEST WARRANTY', 'test', 'Test', '123', 'Test', '2025-04-30', '2194-01-31', 'Available', 'Test', 'TOOL-dd3c85cb-a802-46c3-b944-fbba80b5811c.png', 'TOOL-dd3c85cb-a802-46c3-b944-fbba80b5811c', '2025-05-19', 'Admin'),
(30, '1747654861451-828651861.png', 'TEST 2', 'gbhjn`gbh`', 'vgbhnj', 'vgbhnkj', 'vgbhj', '2025-04-28', '2194-01-28', 'Available', 'v8tm', 'TOOL-7cc172ff-db8d-402e-9b91-d4567bfebc3c.png', 'TOOL-7cc172ff-db8d-402e-9b91-d4567bfebc3c', '2025-05-19', 'Admin'),
(31, '1747655031994-72737644.png', 'TEST3', 'g hj', 'guhnj', 'vygbhnkj', 'ygbhnjmk', '2025-05-17', '2025-08-17', 'Available', 'fvgbhjnkm', 'TOOL-857a1a4f-f8b2-4257-9209-5a4015efc19a.png', 'TOOL-857a1a4f-f8b2-4257-9209-5a4015efc19a', '2025-05-19', 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `tool_logs`
--

CREATE TABLE `tool_logs` (
  `log_id` int(11) NOT NULL,
  `tool_id` int(11) NOT NULL,
  `action` varchar(50) NOT NULL,
  `action_by` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `remarks` text DEFAULT NULL,
  `tool_name` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tool_logs`
--

INSERT INTO `tool_logs` (`log_id`, `tool_id`, `action`, `action_by`, `date`, `remarks`, `tool_name`, `tag`) VALUES
(12, 2, 'Reserved', 'Unknown', '2025-05-08 02:39:45', 'Tool reserved for Project: undefined (ID: 162)', 'Dartek Angle Grinder', 'POWER-ANGLGRNDR_DARTEK-1'),
(13, 3, 'Issued-Out', 'Unknown', '2025-05-08 02:41:39', 'Tool issued-out for Project: undefined (ID: 163)', 'Megaman Floodlight ', 'POWER-FLDLIGHT_MGMN-1'),
(14, 4, 'Reserved', 'Unknown', '2025-05-08 02:43:36', 'Tool reserved for Project: undefined (ID: 164)', 'Makita Nail Gun', 'POWER-NAILGUN_MKTA-1'),
(15, 5, 'Issued-Out', 'Unknown', '2025-05-08 02:45:38', 'Tool issued-out for Project: undefined (ID: 165)', 'Welding Mask', 'OTHERS-WLDGMASK-1'),
(16, 4, 'Reserved', 'Unknown', '2025-05-08 03:00:32', 'Tool reserved for Project: undefined (ID: 168)', 'Makita Nail Gun', 'POWER-NAILGUN_MKTA-1'),
(17, 22, 'Reserved', 'Unknown', '2025-05-08 03:01:06', 'Tool reserved for Project: undefined (ID: 169)', 'ADDED', 'tygbhunj'),
(18, 24, 'Reserved', 'Unknown', '2025-05-08 03:02:17', 'Tool reserved for Project: undefined (ID: 170)', 'HAHAHAHA', 'gbhkj'),
(19, 26, 'Reserved', 'Unknown', '2025-05-08 03:06:04', 'Tool reserved for Project: undefined (ID: 171)', 'TEST TAG', 'vuygbhnj'),
(20, 27, 'Reserved', 'Unknown', '2025-05-08 03:08:46', 'Tool reserved for Project: undefined (ID: 172)', 'TEST TAG', 'vuygbhnj'),
(21, 28, 'Reserved', 'Unknown', '2025-05-08 06:29:30', 'Tool reserved for Project: undefined (ID: 173)', 'TEST TAG', 'vuygbhnj'),
(22, 25, 'Issued-Out', 'Unknown', '2025-05-08 06:42:52', 'Tool issued-out for Project: undefined (ID: 174)', 'kbjnm', 'hblnjk'),
(23, 29, 'Added', 'Admin', '2025-05-19 11:39:07', 'Test', 'TEST WARRANTY', '123'),
(24, 30, 'Added', 'Admin', '2025-05-19 11:41:01', 'v8tm', 'TEST 2', 'vgbhnkj'),
(25, 31, 'Added', 'Admin', '2025-05-19 11:43:52', 'fvgbhjnkm', 'TEST3', 'vygbhnkj'),
(26, 29, 'Issued-Out', 'Unknown', '2025-05-19 15:26:14', 'Tool issued-out for Project: undefined (ID: 175)', 'TEST WARRANTY', '123'),
(27, 30, 'Issued-Out', 'Unknown', '2025-05-19 15:26:14', 'Tool issued-out for Project: undefined (ID: 175)', 'TEST 2', 'vgbhnkj'),
(28, 31, 'Issued-Out', 'Unknown', '2025-05-19 15:26:14', 'Tool issued-out for Project: undefined (ID: 175)', 'TEST3', 'vygbhnkj'),
(29, 23, 'Issued-Out', 'Unknown', '2025-05-20 02:06:59', 'Tool issued-out for Project: undefined (ID: 176)', 'NEWYVGBIHNKJ', 'gbhunjmk'),
(30, 25, 'Issued-Out', 'Unknown', '2025-05-20 02:06:59', 'Tool issued-out for Project: undefined (ID: 176)', 'kbjnm', 'hblnjk'),
(31, 30, 'Issued-Out', 'Unknown', '2025-05-20 02:06:59', 'Tool issued-out for Project: undefined (ID: 176)', 'TEST 2', 'vgbhnkj');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(100) NOT NULL,
  `profile` varchar(300) NOT NULL,
  `status` varchar(255) NOT NULL,
  `date_created` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `profile`, `status`, `date_created`) VALUES
(1, 'Admin', 'admin', '$2a$10$ysgopAQfZawXdZ1g/FR14.H6AHlM9WXN3b8xgFumPfCslOuggBGrC', 'Admin', '', 'Active', '0000-00-00'),
(3, 'Staff', 'staff', '$2a$10$HubgO1cxr6VuWG1/ckSXm.j/C1CAHT7IvcnCRaO5Xq5SD/4FWinmm', 'Staff', '', 'Active', '0000-00-00'),
(4, 'Manager', 'manager', '$2a$10$1zRRsugnSAyQP87QqIV9cuNIoVhbaV/CEP3bgnZ2zGkguu0.Y72EC', 'Manager', '', 'Active', '0000-00-00'),
(15, 'Nolly Alvarado', 'nolly', '$2b$10$0Goa0nFhCO3cxMKw7hXZOe0HFlx.BGfCaJWWvbC26RfvRa1JLE.cO', 'Admin', '', 'Active', '2025-05-06');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicle_id` int(11) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `plate_no` varchar(20) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `fuel_type` varchar(50) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `acquisition_date` date DEFAULT NULL,
  `status` enum('Available','Reserved','Issued-out','Cancelled') DEFAULT 'Available',
  `remarks` varchar(255) DEFAULT NULL,
  `maintenance_due` date DEFAULT NULL,
  `assigned_driver` varchar(100) DEFAULT NULL,
  `qr` varchar(255) DEFAULT NULL,
  `warranty` varchar(255) DEFAULT NULL,
  `qr_code_id` varchar(255) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicle_id`, `picture`, `name`, `brand`, `plate_no`, `category`, `fuel_type`, `location`, `acquisition_date`, `status`, `remarks`, `maintenance_due`, `assigned_driver`, `qr`, `warranty`, `qr_code_id`, `created_at`, `created_by`) VALUES
(1, '1745827381363-558391668.jpg', 'Hino Dump Truck', 'Hino Motors', 'DMP-2345', 'Dump Truck', 'Diesel', 'Yar Main', '2021-04-13', 'Reserved', 'Needs Maintenance', '2025-04-25', 'Nolly Alvarado', 'VEHICLE-8e8b067a-1351-44e1-adf1-7b0e2741a2cb.png', '2025-04-22', 'VEHICLE-8e8b067a-1351-44e1-adf1-7b0e2741a2cb', '2025-05-07', ''),
(2, '1745827714814-712914986.jpg', 'Isuzu Giga Crane Truck', 'Isuzu', 'CRN-6789', 'Crane Truck', 'Diesel', 'Yar Main', '2025-04-27', 'Available', 'Brand New', '2025-05-27', 'Angelo Padilla', 'VEHICLE-50ed45fc-4dc9-44d0-8682-a8f523bea291.png', '2026-04-27', 'VEHICLE-50ed45fc-4dc9-44d0-8682-a8f523bea291', '2025-05-07', ''),
(3, '1745827872146-579794368.jpg', 'Mitsubishi Fuso Water Tanker', 'Mitsubishi', 'WTK-1122', 'Tanker Truck', 'Diesel', 'Main Warehouse', '2025-04-07', 'Issued-out', 'Change oil nyo ya', '2025-08-25', 'Jestro Maverick De Castro', 'VEHICLE-dc79ceea-11ad-49c6-9722-f55416ca149e.png', '2027-04-12', 'VEHICLE-dc79ceea-11ad-49c6-9722-f55416ca149e', '2025-05-07', ''),
(4, '1745827984739-89621926.jpg', 'Hyundai HD320 Flatbed Truck', 'Hyundai', 'FLT-7788', 'Flatbed Truck', 'Diesel', 'Main Warehouse', '2023-04-11', 'Available', 'Brake is a bit off', '2025-09-04', 'Edan Raymunmo', 'VEHICLE-a3ff6853-4af3-4dc9-aceb-9a8470790dc2.png', '2028-04-27', 'VEHICLE-a3ff6853-4af3-4dc9-aceb-9a8470790dc2', '2025-05-07', ''),
(5, '1745828075830-924813918.jpg', 'Foton Tornado Tipper Truck', 'Foton', 'TPR-3344', 'Tipper Truck', 'Diesel', 'Main Warehouse', '2025-04-17', 'Reserved', 'Needs to change oil', '2025-09-29', 'Ronald Labrado', 'VEHICLE-f56a2adf-3b71-4820-b9ab-e0d5bef22288.png', '2026-04-13', 'VEHICLE-f56a2adf-3b71-4820-b9ab-e0d5bef22288', '2025-05-07', ''),
(17, '1746550156237-654854125.jpg', 'CREATED BY', 'bhnjkm', 'bkhnjk', 'mbhkjn,k', 'Gasoline', 'm,hnjkm', '2025-05-06', 'Issued-out', 'blnjk.,', '2025-05-19', 'blnj.', 'VEHICLE-7275bab1-1eb7-4e6d-a2cc-fca0ce3acbed.png', '2025-05-19', 'Admin', '2025-05-07', 'VEHICLE-7275bab1-1eb7-4e6d-a2cc-fca0ce3acbed'),
(18, '1746550305730-798074432.jpg', 'vukbj', 'kbhj m', 'hbjn m', 'hblnjk, m', 'Gasoline', 'hknlm', '2025-04-28', 'Available', ' mjn', '2025-05-20', 'hnijmkl', 'VEHICLE-f40e3e65-a33d-419c-b4fe-81fc44c7c2f0.png', '2025-05-05', 'VEHICLE-f40e3e65-a33d-419c-b4fe-81fc44c7c2f0', '2025-05-07', 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles_logs`
--

CREATE TABLE `vehicles_logs` (
  `id` int(11) NOT NULL,
  `vehicle_name` varchar(255) NOT NULL,
  `performed_by` varchar(100) DEFAULT NULL,
  `issued_date` datetime NOT NULL,
  `status` enum('Issued Out','Returned') DEFAULT 'Issued Out'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles_logs`
--

INSERT INTO `vehicles_logs` (`id`, `vehicle_name`, `performed_by`, `issued_date`, `status`) VALUES
(40, 'Hino Dump Truck', 'NOBODY', '2025-05-02 00:22:36', 'Issued Out'),
(41, 'Hino Dump Truck', 'NOBODY', '2025-05-02 00:23:08', 'Returned'),
(42, 'Hino Dump Truck', 'hello', '2025-05-02 00:26:35', 'Issued Out'),
(43, 'Hino Dump Truck', 'hello', '2025-05-02 00:26:42', 'Returned'),
(44, 'Hino Dump Truck', 'sample', '2025-05-02 00:32:08', 'Issued Out');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `consumables`
--
ALTER TABLE `consumables`
  ADD PRIMARY KEY (`consumable_id`);

--
-- Indexes for table `consumables_logs`
--
ALTER TABLE `consumables_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`);

--
-- Indexes for table `project_consumables`
--
ALTER TABLE `project_consumables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `consumable_id` (`consumable_id`);

--
-- Indexes for table `project_tools`
--
ALTER TABLE `project_tools`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `tool_id` (`tool_id`);

--
-- Indexes for table `project_vehicles`
--
ALTER TABLE `project_vehicles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `vehicle_id` (`vehicle_id`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`tool_id`);

--
-- Indexes for table `tool_logs`
--
ALTER TABLE `tool_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `tool_id` (`tool_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicle_id`);

--
-- Indexes for table `vehicles_logs`
--
ALTER TABLE `vehicles_logs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `consumables`
--
ALTER TABLE `consumables`
  MODIFY `consumable_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `consumables_logs`
--
ALTER TABLE `consumables_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;

--
-- AUTO_INCREMENT for table `project_consumables`
--
ALTER TABLE `project_consumables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `project_tools`
--
ALTER TABLE `project_tools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `project_vehicles`
--
ALTER TABLE `project_vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tools`
--
ALTER TABLE `tools`
  MODIFY `tool_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `tool_logs`
--
ALTER TABLE `tool_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `vehicles_logs`
--
ALTER TABLE `vehicles_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `project_consumables`
--
ALTER TABLE `project_consumables`
  ADD CONSTRAINT `project_consumables_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_consumables_ibfk_2` FOREIGN KEY (`consumable_id`) REFERENCES `consumables` (`consumable_id`) ON DELETE CASCADE;

--
-- Constraints for table `project_tools`
--
ALTER TABLE `project_tools`
  ADD CONSTRAINT `project_tools_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_tools_ibfk_2` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`tool_id`) ON DELETE CASCADE;

--
-- Constraints for table `project_vehicles`
--
ALTER TABLE `project_vehicles`
  ADD CONSTRAINT `project_vehicles_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_vehicles_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tool_logs`
--
ALTER TABLE `tool_logs`
  ADD CONSTRAINT `tool_logs_ibfk_1` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`tool_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

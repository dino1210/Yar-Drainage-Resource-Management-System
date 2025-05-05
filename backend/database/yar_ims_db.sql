-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2025 at 02:45 AM
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
(1, '1745822603388-364008207.jpg', ' DISC-002', 'Cutting Disc 4\" 2.5mm', 0, 20, 'pcs', ' Rack 3-Drawer 11', '2025-04-28', 'In Stock', '', ' Cutting Disk'),
(2, '1745822713321-485494957.jpg', ' DBIT-006', ' Drill Bit Steel 1/2', 0, 3, 'pcs', ' Rack 3-Drawer 17', '2025-04-28', 'In Stock', '', ' Drill Bit'),
(3, '1745822960475-604811994.jpg', ' WROD-00', ' Welding Rod N-6011', 10, 25, 'kg', ' Rack 3-Drawer 15', '2025-04-28', 'In Stock', '', ' Welding Rod'),
(4, '1745823073022-335597718.jpg', ' CLMP-006', ' Metal Clamp 2\" 2 Holes Fab', 0, 5, 'pcs', 'Rcabinet-Drawer 3', '2025-04-28', 'In Stock', '', ' Metal Clamp'),
(5, '1745823211823-557831080.jpg', ' NAIL-009', ' Concrete Nail 1 1/2\"', 0, 5, 'kg', 'BCabinet-Drawer 8', '2025-04-28', 'In Stock', '', ' Nail'),
(8, '1745987401853-34847443.png', ' test', ' stest', 7, 6, 'kg', ' manila', '2025-04-30', 'In Stock', '', ' test'),
(9, '1746088437828-377720996.png', 'SADFASDF', ' SDASD', 12, 12, 'bottles', ' ASDSA', '2025-05-01', 'In Stock', '', 'VDSFDSF');

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
  `manager` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `name`, `person_in_charge`, `location`, `description`, `start_date`, `end_date`, `created_at`, `manager`) VALUES
(71, 'hbjn', ' jm,', ' jbnm', 'hblnjk', '2025-05-05', '2025-05-06', '2025-05-04 12:54:19', ''),
(72, 'GBHKJNL<', 'GBKHNJM', 'GBHKNJML', 'gbuhnjilmkl,', '2025-05-06', '2025-05-12', '2025-05-04 12:56:24', ''),
(73, 'GBHKJNL<', 'GBKHNJM', 'GBHKNJML', 'gbuhnjilmkl,', '2025-05-06', '2025-05-12', '2025-05-04 12:56:56', ''),
(74, 'hbnljkm', 'hjnkm', 'bhlnjkm,', 'bhnjkml,', '2025-05-13', '2025-05-21', '2025-05-04 12:57:22', ''),
(75, 'INITIAL TEST', 'MAAM MAY', 'MAAM BATAR', 'PUTANGINANYONG DALAWA', '2025-05-06', '2025-05-07', '2025-05-04 13:55:05', ''),
(76, ' bj', 'gbhjn', 'ygbhjn', 'gybhjnk', '2025-05-06', '2025-05-20', '2025-05-04 14:35:41', ''),
(77, 'PUTANGINAMO MAAM MAY', 'ISA KA PA BATAR', 'AGHHHHHHHHHHHHHHH', 'PAKSHET KAYO BOTH', '2025-05-04', '2025-05-05', '2025-05-04 22:59:22', '');

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
(6, 73, 1, 1),
(7, 74, 1, 1),
(8, 75, 1, 1),
(9, 76, 1, 1),
(10, 77, 2, 1);

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
(35, 75, 1, '2025-05-04'),
(36, 76, 2, '2025-05-04'),
(37, 77, 3, '2025-05-05');

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
(17, 75, 1, '2025-05-04 13:55:05'),
(18, 76, 3, '2025-05-04 14:35:41'),
(19, 77, 4, '2025-05-04 22:59:22');

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
  `status` varchar(100) DEFAULT 'Available',
  `remarks` text DEFAULT NULL,
  `qr` mediumtext DEFAULT NULL,
  `qr_code_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tools`
--

INSERT INTO `tools` (`tool_id`, `picture`, `name`, `brand`, `category`, `tag`, `description`, `purchase_date`, `warranty`, `status`, `remarks`, `qr`, `qr_code_id`) VALUES
(1, '1745821307732-503816072.jpg', 'Contender Welding Machine', 'Contender', 'Welding Machine', 'POWER-WLDGM_CONTNDR-1', 'Input Voltage, 220. Maximum Rod Diameter, 4.0 mm. Rated Input Capacity, 10.2', '2025-03-31', '2026-04-27', 'Reserved', 'Brand New', 'TOOL-312edc10-82b0-4500-8683-a031996e18f4.png', 'TOOL-312edc10-82b0-4500-8683-a031996e18f4'),
(2, '1745821628548-538938628.jpg', 'Dartek Angle Grinder', 'Dartek', 'Angle Grinder', 'POWER-ANGLGRNDR_DARTEK-1', 'Rated Input Power, 760W. No-Load Speed, 11500r/min. Max Wheel Diameter, 100mm. Hole Diameter of Wheel, 16mm.', '2025-03-31', '2025-04-24', 'Reserved', 'Brand New', 'TOOL-cadb0389-23f2-4702-a5a8-1ece4decfc9c.png', 'TOOL-cadb0389-23f2-4702-a5a8-1ece4decfc9c'),
(3, '1745821790372-377372672.jpg', 'Megaman Floodlight ', 'Megaman', 'Light', 'POWER-FLDLIGHT_MGMN-1', '0W 840 IP66 IK08. 711433 ; FL TITO 90W 840 IP66 IK08. 710825 ; FL TITO 120W 840 IP66 IK08.', '2025-04-01', '2049-04-13', 'Issued-out', 'Brand New', 'TOOL-ce29f0eb-2fe7-4bba-be16-f3ee03e7dd21.png', 'TOOL-ce29f0eb-2fe7-4bba-be16-f3ee03e7dd21'),
(4, '1745821991819-726796547.jpg', 'Makita Nail Gun', 'Makita', 'Nail Gun', 'POWER-NAILGUN_MKTA-1', 'Nail size capacity: 10-50mm (19/32\"-2\") Nail type: F15-F50 Gauge: 18 Operating pressure: 60-100psi', '2025-03-31', '2027-04-07', 'Available', 'Brand New', 'TOOL-344ede88-66df-4571-adca-79450032c487.png', 'TOOL-344ede88-66df-4571-adca-79450032c487'),
(5, '1745822173903-752629888.jpg', 'Welding Mask', 'Generic', 'Welding Mask', 'OTHERS-WLDGMASK-1', 'equipped with #12 Dark Glass for safety', '2025-03-31', '2025-04-08', 'Available', 'Brand New', 'TOOL-4b262466-e3ba-40b2-ae32-1418627ce760.png', 'TOOL-4b262466-e3ba-40b2-ae32-1418627ce760');

-- --------------------------------------------------------

--
-- Table structure for table `tools_log`
--

CREATE TABLE `tools_log` (
  `log_id` int(11) NOT NULL,
  `tool_id` int(11) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `project_location` varchar(255) NOT NULL,
  `tool_tag` varchar(255) NOT NULL,
  `person_in_charge` varchar(255) NOT NULL,
  `peformed_by` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(5, 'Angelo Padilla', 'angelo@gmail.com', '$2a$10$P6q/ONJd9m7bMzfwD4TMJugPFtP2apWKyeb478CMy/isNN3oYTgMK', 'Admin', '', 'Active', '0000-00-00'),
(6, 'ronald', 'ronald', '$2b$10$7klWLslBs8v6VKC66VCEke8iYJ09YzakllcEfPHnuTh.yQ.SuNTSu', 'Admin', '', 'Active', '2025-04-27'),
(7, 'edan', 'edan', '$2b$10$OKOLZJ8/A/O0.E8xehH3XuYJmFj4t0q8Gtdt3G2ACaz8kKdCHqNsW', 'Admin', '', 'Active', '2025-04-28'),
(8, 'ghelo', 'ghelo', '$2b$10$aQxt8l2f5b1ssbijGdAqheLW1.Hd05abzpMlyTXOuOMvESXNHH49.', 'Staff', '', 'Active', '2025-04-28'),
(9, 'jestro', 'jestro', '$2b$10$t0MxpvHUfh9DX6opn7zPDescw3O6h/ChtyOnISu3qPB5lSH6bNnDG', 'Admin', '', 'Active', '2025-04-28'),
(10, 'ronaldjr', 'ronaldjr', '$2b$10$chCU3FQeSgVSXaFjJNh/IefjvfIcloriWOH/WI29N97mjEKwQ7I8e', 'Admin', '', 'Active', '2025-04-28'),
(11, 'Test', 'test@gmail.com', '$2b$10$U8UmDZHrqrWMBbTva8QXj.CerWjePGPWXS/KiikC5KeIOkbL.sbBS', 'Admin', '', 'Active', '2025-04-30'),
(12, 'ronald', 'ronald', '$2b$10$mYEEsT85MOWVcKEG4ZaFR.BJNp3flF0RL49o1vqlshlPJEWx7mI8O', 'Admin', '', 'Active', '2025-04-30'),
(13, 'RonaldGwapo', 'ronaldjr', '$2b$10$WSB4f1pu0sWFJYKpI16eYOTgsMlvVwQ3KwGvjfW9n6xoU4qPiHKSi', 'Admin', '', 'Active', '2025-05-01'),
(14, 'Itchoy', 'itchoy', '$2b$10$UWTOXYc1x4I09I.rmJyBF.niDYq9tniQHtgo.9W7t0tGquS/AIcT.', 'Admin', '', 'Active', '2025-05-01');

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
  `status` varchar(50) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `maintenance_due` date DEFAULT NULL,
  `assigned_driver` varchar(100) DEFAULT NULL,
  `qr` varchar(255) DEFAULT NULL,
  `warranty` varchar(255) DEFAULT NULL,
  `qr_code_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicle_id`, `picture`, `name`, `brand`, `plate_no`, `category`, `fuel_type`, `location`, `acquisition_date`, `status`, `remarks`, `maintenance_due`, `assigned_driver`, `qr`, `warranty`, `qr_code_id`) VALUES
(1, '1745827381363-558391668.jpg', 'Hino Dump Truck', 'Hino Motors', 'DMP-2345', 'Dump Truck', 'Diesel', 'Yar Main', '2021-04-13', 'Reserved', 'Needs Maintenance', '2025-04-25', 'Nolly Alvarado', 'VEHICLE-8e8b067a-1351-44e1-adf1-7b0e2741a2cb.png', '2025-04-22', 'VEHICLE-8e8b067a-1351-44e1-adf1-7b0e2741a2cb'),
(2, '1745827714814-712914986.jpg', 'Isuzu Giga Crane Truck', 'Isuzu', 'CRN-6789', 'Crane Truck', 'Diesel', 'Yar Main', '2025-04-27', 'Available', 'Brand New', '2025-05-27', 'Angelo Padilla', 'VEHICLE-50ed45fc-4dc9-44d0-8682-a8f523bea291.png', '2026-04-27', 'VEHICLE-50ed45fc-4dc9-44d0-8682-a8f523bea291'),
(3, '1745827872146-579794368.jpg', 'Mitsubishi Fuso Water Tanker', 'Mitsubishi', 'WTK-1122', 'Tanker Truck', 'Diesel', 'Main Warehouse', '2025-04-07', 'Reserved', 'Change oil nyo ya', '2025-08-25', 'Jestro Maverick De Castro', 'VEHICLE-dc79ceea-11ad-49c6-9722-f55416ca149e.png', '2027-04-12', 'VEHICLE-dc79ceea-11ad-49c6-9722-f55416ca149e'),
(4, '1745827984739-89621926.jpg', 'Hyundai HD320 Flatbed Truck', 'Hyundai', 'FLT-7788', 'Flatbed Truck', 'Diesel', 'Main Warehouse', '2023-04-11', 'Issued-out', 'Brake is a bit off', '2025-09-04', 'Edan Raymunmo', 'VEHICLE-a3ff6853-4af3-4dc9-aceb-9a8470790dc2.png', '2028-04-27', 'VEHICLE-a3ff6853-4af3-4dc9-aceb-9a8470790dc2'),
(5, '1745828075830-924813918.jpg', 'Foton Tornado Tipper Truck', 'Foton', 'TPR-3344', 'Tipper Truck', 'Diesel', 'Main Warehouse', '2025-04-17', 'Available', 'Needs to change oil', '2025-09-29', 'Ronald Labrado', 'VEHICLE-f56a2adf-3b71-4820-b9ab-e0d5bef22288.png', '2026-04-13', 'VEHICLE-f56a2adf-3b71-4820-b9ab-e0d5bef22288');

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
-- Indexes for table `tools_log`
--
ALTER TABLE `tools_log`
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
  MODIFY `consumable_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `consumables_logs`
--
ALTER TABLE `consumables_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `project_consumables`
--
ALTER TABLE `project_consumables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `project_tools`
--
ALTER TABLE `project_tools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `project_vehicles`
--
ALTER TABLE `project_vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tools`
--
ALTER TABLE `tools`
  MODIFY `tool_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tools_log`
--
ALTER TABLE `tools_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

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
-- Constraints for table `tools_log`
--
ALTER TABLE `tools_log`
  ADD CONSTRAINT `tools_log_ibfk_1` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`tool_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

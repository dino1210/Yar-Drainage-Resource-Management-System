-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2025 at 03:40 AM
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
  `id` int(11) NOT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `manager` varchar(255) DEFAULT NULL,
  `person_in_charge` varchar(255) DEFAULT NULL,
  `tools_equipment_used` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('Ongoing','Completed','Upcoming') DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `creator` varchar(100) DEFAULT 'Yard Admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `manager`, `person_in_charge`, `tools_equipment_used`, `start_date`, `end_date`, `status`, `remarks`, `creator`) VALUES
(1, 'Construction of Building A', 'Alice Amanda', 'Johnny Hernandez', 'Excavator, Mixer, Cement', '2024-02-01', '2024-12-01', 'Ongoing', 'Team B', 'Yard Admin'),
(2, 'Renovation of Office HQ', 'Brian Santos', 'Micaela Leonardo', 'Ladder, Paint Sprayer', '2023-01-10', '2023-05-30', 'Completed', 'Final inspection passed', 'Yard Admin'),
(3, 'Bridge Maintenance Project', 'Clarence Enriquez', 'Eric Marcelo', 'Hydraulic Jack, Welder', '2024-09-15', '2024-11-20', 'Upcoming', 'Scaffolding', 'Yard Admin'),
(4, 'Road Paving Project', 'Angelo Gregorio', 'Daniel Allen', 'Mixer, Roller, Cement', '2024-05-10', '2024-10-30', 'Ongoing', 'Concrete Mixer', 'Yard Admin'),
(5, 'Airport Expansion', 'Jennifer Cruz', 'Tomas Javier', 'Bulldozer, Concrete Pump', '2024-06-01', '2025-01-15', 'Upcoming', 'Runway ready', 'Yard Admin'),
(6, 'Highway Widening Project', 'Julia Andrews', 'Jake Dela Rosa', 'Truck, Jackhammer, Mixer', '2024-03-20', '2024-10-10', 'Ongoing', 'Heavy usage area', 'Yard Admin'),
(7, 'bake shop', 'nolly', 'NOLLY', 'HAMMER NI THOR ', '2025-04-25', '2025-04-25', 'Upcoming', NULL, 'Yard Admin');

-- --------------------------------------------------------

--
-- Table structure for table `tools`
--

CREATE TABLE `tools` (
  `id` int(11) NOT NULL,
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

INSERT INTO `tools` (`id`, `picture`, `name`, `brand`, `category`, `tag`, `description`, `purchase_date`, `warranty`, `status`, `remarks`, `qr`, `qr_code_id`) VALUES
(79, '1745625844538-701692642.jpg', 'tygbh', 'bkhj', 'bhjn', 'khbjn', 'gukhj', '2025-04-01', '2025-04-08', 'Available', 'jknm', 'TOOL-487a2c4b-e99f-416e-9724-7d76ff8ae7c0.png', 'TOOL-487a2c4b-e99f-416e-9724-7d76ff8ae7c0');

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
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `profile`, `status`) VALUES
(1, 'Admin', 'admin', '$2a$10$ysgopAQfZawXdZ1g/FR14.H6AHlM9WXN3b8xgFumPfCslOuggBGrC', 'Admin', '', ''),
(2, 'Project Manager', 'projectmanager', '$2a$10$5igFGny7DJqMhytkBf4kVeqGbM4K6W/irDNE85PkcQlpgKXDJspY2', 'Manager', '', ''),
(3, 'Staff', 'staff@gmail.com', '$2a$10$HubgO1cxr6VuWG1/ckSXm.j/C1CAHT7IvcnCRaO5Xq5SD/4FWinmm', 'Staff', '', ''),
(4, 'Nolly Alvarado', 'nolly@gmail.com', '$2a$10$1w0n9/8yC97EtQdzZIOarelAVOfrvIPrF.Pxk2CQRXDlQ26O9C.Q6', 'Staff', '', 'Active'),
(5, 'Angelo Padilla', 'angelo@gmail.com', '$2a$10$P6q/ONJd9m7bMzfwD4TMJugPFtP2apWKyeb478CMy/isNN3oYTgMK', 'Admin', '', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
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
  `warranty` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `tools`
--
ALTER TABLE `tools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

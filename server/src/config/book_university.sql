-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 04, 2025 at 01:29 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `book_university`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `titleBook` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `description` text DEFAULT NULL,
  `canMeet` enum('yes','no') DEFAULT 'no',
  `contactInfo` varchar(255) DEFAULT NULL,
  `bookPic` varchar(255) DEFAULT NULL,
  `checkStatusBooks` enum('unavailable','available') DEFAULT 'unavailable',
  `subjectId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `titleBook`, `price`, `description`, `canMeet`, `contactInfo`, `bookPic`, `checkStatusBooks`, `subjectId`, `userId`, `createdAt`, `updatedAt`) VALUES
(22, 'Busniness Partner', 200, 'อังกฤษจ้า', 'no', '', 'uploads/bookPic-1741066293739-87322535.jpg', 'available', 1, 4, '2025-03-04 05:31:33', '2025-03-04 12:18:12'),
(23, 'Business Finance', 200, 'มาๆอยากปล่อย ซื้อหน่อย', 'no', NULL, 'uploads/bookPic-1741066324624-708615819.jpg', 'available', 5, 4, '2025-03-04 05:32:04', '2025-03-04 05:32:24');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `bookId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `bookId`, `userId`) VALUES
(63, 22, 5),
(64, 23, 5);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `subjectCode` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `subjectCode`) VALUES
(6, 'AC101'),
(5, 'BA304'),
(7, 'BA923'),
(8, 'BN309'),
(1, 'GE071'),
(2, 'GE072'),
(3, 'GE073'),
(4, 'GE074');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `studentId` varchar(255) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_role` enum('student','admin') NOT NULL DEFAULT 'student',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `studentId`, `fullName`, `email`, `password`, `user_role`, `createdAt`, `updatedAt`) VALUES
(1, 'admin1', 'Nontprawitch Saetang', 'admin1@gmail.com', '$2a$10$cdvtKfw81NdGhATvxFXnSej9sQj5eS5gtIsknICSiZcRPAmZOP3Iy', 'admin', '2025-02-26 13:11:02', '2025-02-26 13:12:52'),
(2, 'admin2', 'Chanidapha Singsamran', 'admin2@gmail.com', '$2a$10$.kypurHNs/n12xnK5NpuLO/QKrsr/2ky3Y.sdqndIlqjUfLSmoQ96', 'admin', '2025-02-26 13:11:52', '2025-02-26 13:12:56'),
(3, 'admin3', 'Chaianun Yamtuan', 'admin3@gmail.com', '$2a$10$KoVPw6tFqADeGXRJFIW.8uptwvAasnYdftkqzuW1IEBbZx/wa9DW2', 'admin', '2025-02-26 13:12:27', '2025-02-26 13:13:01'),
(4, '2210511106011', 'WarunYouyu Wungmuthitakul ', '2210511106011@live4.utcc.ac.th', '$2a$10$8KGQuf./lFEfFMUxjGnDueco4KSY0ZajJguJ5FeltLVsOoi0CQSt.', 'student', '2025-02-26 13:21:22', '2025-02-26 13:21:22'),
(5, '2210511106013', 'Pattanan Thararat', '2210511106013@live4.utcc.ac.th', '$2a$10$8e/JwNmAxIueLJLZPmeWIeEMZlW0e0AEC5iOJnuNDXGMb1hgkpihq', 'student', '2025-02-26 13:23:11', '2025-02-26 13:23:11'),
(6, '2210511106012', 'Prakasit Charoonruang ', '2210511106012@live4.utcc.ac.th', '$2a$10$dQf5eYNuSCE/YidYF4G41eKHiDcd2AScV1ddpyozsCWMoI50.JevG', 'student', '2025-03-03 14:10:05', '2025-03-03 14:10:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `subjectId` (`subjectId`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookId` (`bookId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subjectCode` (`subjectCode`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `studentId` (`studentId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `books_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `fk_cart_book` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`),
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

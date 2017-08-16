SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

CREATE DATABASE IF NOT EXISTS `we3graph` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `we3graph`;

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `ID` int(11) NOT NULL,
  `Name` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `GraphID` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `commands`;
CREATE TABLE IF NOT EXISTS `commands` (
  `GraphID` int(11) NOT NULL,
  `CommandID` bigint(20) NOT NULL,
  `Name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `ClientID` int(11) NOT NULL,
  `IsEffective` tinyint(1) NOT NULL DEFAULT '1',
  `Param1` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `Param2` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `Param3` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `Param4` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `Param5` varchar(50) COLLATE utf8_unicode_ci DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `folders`;
CREATE TABLE IF NOT EXISTS `folders` (
  `ID` int(11) NOT NULL,
  `Name` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `folders` (`ID`, `Name`) VALUES
(1, 'Default');

DROP TABLE IF EXISTS `graph-access-tokens`;
CREATE TABLE IF NOT EXISTS `graph-access-tokens` (
  `UserID` int(11) NOT NULL,
  `Token` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `IsValid` tinyint(1) NOT NULL,
  `ValidUntil` datetime NOT NULL,
  `GraphID` int(11) NOT NULL,
  `PermissionType` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `graphs`;
CREATE TABLE IF NOT EXISTS `graphs` (
  `ID` int(11) NOT NULL,
  `Name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `FolderID` int(11) NOT NULL,
  `CommandSetVersion` int(11) NOT NULL,
  `RenderEngineGUID` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `groups`;
CREATE TABLE IF NOT EXISTS `groups` (
  `ID` int(11) NOT NULL,
  `Name` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `groups` (`ID`, `Name`) VALUES
(1, 'Default');

DROP TABLE IF EXISTS `memberships`;
CREATE TABLE IF NOT EXISTS `memberships` (
  `UserID` int(11) NOT NULL,
  `GroupID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `GroupID` int(11) NOT NULL,
  `FolderID` int(11) NOT NULL,
  `Type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `permissions` (`GroupID`, `FolderID`, `Type`) VALUES
(1, 1, 2);

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `ID` int(11) NOT NULL,
  `Username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `FirstName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `LastName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(200) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `users` (`ID`, `Username`, `Password`, `FirstName`, `LastName`, `Email`) VALUES
(1, 'admin', '$2y$10$ndFsRJRndaaVi.IeNm42h.Lu450f2HHwwVLP9mfYYnCghP6GwC9CW', 'Admin first name', 'Admin last name', 'Admin email');

DROP TABLE IF EXISTS `who-tokens`;
CREATE TABLE IF NOT EXISTS `who-tokens` (
  `UserID` int(11) NOT NULL,
  `Token` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `IsValid` tinyint(1) NOT NULL,
  `ValidUntil` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


ALTER TABLE `clients`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `commands`
  ADD PRIMARY KEY (`CommandID`), ADD KEY `Param1` (`Param1`), ADD KEY `IsEffective` (`IsEffective`);

ALTER TABLE `folders`
  ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `Name` (`Name`);

ALTER TABLE `graph-access-tokens`
  ADD KEY `Token` (`Token`);

ALTER TABLE `graphs`
  ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `Name` (`Name`,`FolderID`), ADD KEY `FolderID` (`FolderID`);

ALTER TABLE `groups`
  ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `Name` (`Name`);

ALTER TABLE `memberships`
  ADD KEY `UserID` (`UserID`), ADD KEY `GroupID` (`GroupID`);

ALTER TABLE `permissions`
  ADD PRIMARY KEY (`GroupID`,`FolderID`), ADD KEY `FolderID` (`FolderID`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `Username` (`Username`);

ALTER TABLE `who-tokens`
  ADD KEY `Token` (`Token`);


ALTER TABLE `clients`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `commands`
  MODIFY `CommandID` bigint(20) NOT NULL AUTO_INCREMENT;
ALTER TABLE `folders`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
ALTER TABLE `graphs`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `groups`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;

ALTER TABLE `graphs`
ADD CONSTRAINT `graphs_ibfk_1` FOREIGN KEY (`FolderID`) REFERENCES `folders` (`ID`);

ALTER TABLE `memberships`
ADD CONSTRAINT `memberships_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
ADD CONSTRAINT `memberships_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `groups` (`ID`);

ALTER TABLE `permissions`
ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`GroupID`) REFERENCES `groups` (`ID`),
ADD CONSTRAINT `permissions_ibfk_2` FOREIGN KEY (`FolderID`) REFERENCES `folders` (`ID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-11-2025 a las 15:17:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cafe`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacen`
--

CREATE TABLE `almacen` (
  `ID_Almacen` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Descripcion` varchar(350) NOT NULL,
  `Stock` varchar(50) NOT NULL,
  `ID_Usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `almacen`
--

INSERT INTO `almacen` (`ID_Almacen`, `Nombre`, `Descripcion`, `Stock`, `ID_Usuario`) VALUES
(1, 'masi', 're gay', '100', 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `ID_Cargo` int(11) NOT NULL,
  `Nombre_Cargo` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cargo`
--

INSERT INTO `cargo` (`ID_Cargo`, `Nombre_Cargo`) VALUES
(1, 'Administrador'),
(2, 'Recepcionista'),
(3, 'Mozo'),
(4, 'Chef'),
(5, 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comida`
--

CREATE TABLE `comida` (
  `ID_Comida` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Descripcion` varchar(100) NOT NULL,
  `ID_Menu` int(11) NOT NULL,
  `Imagen` varchar(255) DEFAULT NULL,
  `Precio` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comida`
--

INSERT INTO `comida` (`ID_Comida`, `Nombre`, `Descripcion`, `ID_Menu`, `Imagen`, `Precio`) VALUES
(1, 'Espresso', 'Café espresso tradicional', 1, '/img/espresso.png', 1500.00),
(2, 'Cappuccino', 'Café con leche espumada', 1, '/img/cappuccino.jpg', 2200.00),
(3, 'Latte', 'Café con leche vaporizada', 1, '/img/latte.png', 2300.00),
(4, 'Cold Brew', 'Café frío preparado en frío', 1, '/img/coldbrew.png', 2600.00),
(5, 'Medialuna', 'Medialuna dulce artesanal', 1, '/img/medialunas.png', 1200.00),
(6, 'Chocotorta (porción)', 'Torta de chocolate y dulce de leche', 1, '/img/chocotorta.png', 3000.00),
(7, 'Cheesecake (porción)', 'Torta de queso estilo New York', 1, '/img/cheesecake.png', 3200.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `ID_Compra` int(11) NOT NULL,
  `Metodo` varchar(30) NOT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `ID_Usuario` int(11) NOT NULL,
  `ID_Pedido` int(11) DEFAULT NULL,
  `Numero_Tarjeta` varchar(20) DEFAULT NULL,
  `Nombre_Titular` varchar(100) DEFAULT NULL,
  `Fecha_Vencimiento` varchar(7) DEFAULT NULL,
  `CVV` varchar(4) DEFAULT NULL,
  `Fecha_Cobro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `ID_Pedido` int(11) NOT NULL,
  `ID_Usuario` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` varchar(20) NOT NULL DEFAULT 'pendiente',
  `estado_cobro` varchar(20) NOT NULL DEFAULT 'pendiente',
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `productos` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingrediente`
--

CREATE TABLE `ingrediente` (
  `ID_Ingrediente` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Descripcion` varchar(100) NOT NULL,
  `ID_Almacen` int(11) NOT NULL,
  `Stock` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ingrediente`
--

INSERT INTO `ingrediente` (`ID_Ingrediente`, `Nombre`, `Descripcion`, `ID_Almacen`, `Stock`) VALUES
(1, 'Café en grano', 'Café arábica premium', 1, 50),
(2, 'Leche entera', 'Leche fresca pasteurizada', 1, 30),
(3, 'Leche descremada', 'Leche descremada pasteurizada', 1, 25),
(4, 'Azúcar', 'Azúcar refinada', 1, 40),
(5, 'Harina', 'Harina 0000', 1, 20),
(6, 'Manteca', 'Manteca sin sal', 1, 15),
(7, 'Huevo', 'Huevos frescos', 1, 60),
(8, 'Chocolate', 'Chocolate semiamargo', 1, 10),
(9, 'Dulce de leche', 'Dulce de leche tradicional', 1, 8),
(10, 'Queso crema', 'Queso crema Philadelphia', 1, 12),
(11, 'Galletas de chocolate', 'Galletas Oreo', 1, 20),
(12, 'Vainilla', 'Esencia de vainilla', 1, 5),
(13, 'Canela', 'Canela en polvo', 1, 10),
(14, 'Cacao en polvo', 'Cacao amargo en polvo', 1, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `ID_Menu` int(11) NOT NULL,
  `fecha` date NOT NULL DEFAULT current_timestamp(),
  `CHEF_ID` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menu`
--

INSERT INTO `menu` (`ID_Menu`, `fecha`, `CHEF_ID`, `activo`) VALUES
(1, '2025-11-03', 4, 1),
(2, '2025-11-03', 4, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Nacimiento` date NOT NULL,
  `Sexo` varchar(50) NOT NULL,
  `Correo` varchar(50) NOT NULL,
  `Clave` varchar(50) NOT NULL,
  `ID_Cargo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Nombre`, `Apellido`, `Nacimiento`, `Sexo`, `Correo`, `Clave`, `ID_Cargo`) VALUES
(1, 'Santiago', 'Fernández', '1985-03-15', 'M', 'santiago.fernandez@cafemartinez.com', 'admin123', 1),
(2, 'Valentina', 'García', '1992-07-22', 'F', 'valentina.garcia@cafemartinez.com', 'recepcion123', 2),
(3, 'Mateo', 'Rodríguez', '1998-11-08', 'M', 'mateo.rodriguez@cafemartinez.com', 'mozo123', 3),
(4, 'Sofía', 'López', '1990-05-30', 'F', 'sofia.lopez@cafemartinez.com', 'chef123', 4),
(5, 'Martín', 'González', '2000-09-12', 'M', 'martin.gonzalez@gmail.com', 'cliente123', 5),
(6, 'Isabella', 'Martínez', '2002-12-25', 'F', 'isabella.martinez@gmail.com', 'cliente456', 5);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `almacen`
--
ALTER TABLE `almacen`
  ADD PRIMARY KEY (`ID_Almacen`),
  ADD KEY `almacen_ibfk_2` (`ID_Usuario`);

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`ID_Cargo`);

--
-- Indices de la tabla `comida`
--
ALTER TABLE `comida`
  ADD PRIMARY KEY (`ID_Comida`),
  ADD KEY `ID_Menu` (`ID_Menu`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`ID_Compra`),
  ADD KEY `ID_Usuario` (`ID_Usuario`),
  ADD KEY `ID_Pedido` (`ID_Pedido`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`ID_Pedido`),
  ADD KEY `ID_Usuario` (`ID_Usuario`);

--
-- Indices de la tabla `ingrediente`
--
ALTER TABLE `ingrediente`
  ADD PRIMARY KEY (`ID_Ingrediente`),
  ADD KEY `ID_Almacen` (`ID_Almacen`);

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`ID_Menu`),
  ADD KEY `menu_ibfk_1` (`CHEF_ID`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD KEY `ID_Cargo` (`ID_Cargo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `almacen`
--
ALTER TABLE `almacen`
  MODIFY `ID_Almacen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cargo`
--
ALTER TABLE `cargo`
  MODIFY `ID_Cargo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;


--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `ID_Compra` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comida`
--
ALTER TABLE `comida`
  MODIFY `ID_Comida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `ingrediente`
--
ALTER TABLE `ingrediente`
  MODIFY `ID_Ingrediente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `ID_Menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `ID_Pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `almacen`
--
ALTER TABLE `almacen`
  ADD CONSTRAINT `almacen_ibfk_2` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `comida`
--
ALTER TABLE `comida`
  ADD CONSTRAINT `comida_ibfk_1` FOREIGN KEY (`ID_Menu`) REFERENCES `menu` (`ID_Menu`);

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`),
  ADD CONSTRAINT `compra_ibfk_2` FOREIGN KEY (`ID_Pedido`) REFERENCES `pedido` (`ID_Pedido`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `ingrediente`
--
ALTER TABLE `ingrediente`
  ADD CONSTRAINT `ingrediente_ibfk_2` FOREIGN KEY (`ID_Almacen`) REFERENCES `almacen` (`ID_Almacen`);

--
-- Filtros para la tabla `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`CHEF_ID`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`ID_Cargo`) REFERENCES `cargo` (`ID_Cargo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

SET GLOBAL local_infile=1;
CREATE DATABASE IF NOT EXISTS `pizzaDB`;
USE `pizzaDB`;

CREATE TABLE products (
  sku VARCHAR(6) PRIMARY KEY,
  pizzaName VARCHAR(40) NOT NULL,
  price DECIMAL(9, 2) NOT NULL,
  category VARCHAR(20),
  pizzaSize VARCHAR(20),
  ingredients VARCHAR(100),
  launch DATE
);

CREATE TABLE customers (
    customerID VARCHAR(10) PRIMARY KEY,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

CREATE TABLE stores (
    storeID VARCHAR(15) PRIMARY KEY,
    zipcode CHAR(5),
    stateAbbr VARCHAR(2),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    city VARCHAR(30),
    stateFull VARCHAR(30),
    distance DECIMAL(9,6)
);

CREATE TABLE orders (
    orderID INT PRIMARY KEY,
    customerID VARCHAR(10),
    storeID VARCHAR(15),
    orderDate DATETIME,
    nItems INT,
    total DECIMAL(9,2),
    FOREIGN KEY (customerID) REFERENCES customers(customerID),
    FOREIGN KEY (storeID) REFERENCES stores(storeID)
);


CREATE TABLE orderItems (
    orderItemID INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(6),
    orderID INT,
    FOREIGN KEY (orderID) REFERENCES orders(orderID),
    FOREIGN KEY (sku) REFERENCES products(sku)
);


SET GLOBAL local_infile=ON;

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/products.csv'
INTO TABLE products
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/stores.csv'
INTO TABLE stores
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/customers.csv'
INTO TABLE customers
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/orders1.csv'
INTO TABLE orders
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/orders2.csv'
INTO TABLE orders
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/orderItems.csv'
INTO TABLE orderItems
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS
(sku, orderID);
SHOW WARNINGS;





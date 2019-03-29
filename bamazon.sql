DROP DATABASE bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;
CREATE TABLE products
(
    item_id INTEGER(10)
    AUTO_INCREMENT,
    product_name VARCHAR
    (30) NOT NULL,
    department_name VARCHAR
    (30) NOT NULL,
    price_to_customer DECIMAL
    (8,2) NOT NULL,
    stock_quantity INTEGER
    (10) NOT NULL,
    PRIMARY KEY
    (item_id)
);

    INSERT INTO bamazon_db.products
        (product_name, department_name, price_to_customer, stock_quantity)
    VALUES
        ("Eyeliner", "Beauty", 9.50, 100),
        ("Smudge Brush", "Beauty", 5.00, 200),
        ("Eco Glitter", "Beauty", 8.00, 150),
        ("Makeup Wipes", "Beauty", 4.75, 80),
        ("Batteries", "Electronic", 8.65, 50),
        ("USB C Cable", "Electronic", 12.50, 100),
        ("Wireless Charger", "Electronic", 14.50, 120),
        ("Smart Light Bulbs", "Electronic", 24.50, 130),
        ("Rose Water", "Grocery", 3.50, 200),
        ("Coffee Beans", "Grocery", 7.50, 45);
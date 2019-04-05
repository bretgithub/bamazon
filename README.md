# Bamazon

## Description

This application implements a simple command line based storefront using the npm [inquirer](https://www.npmjs.com/package/inquirer) package and the MySQL database backend together with the npm [mysql](https://www.npmjs.com/package/mysql) package. The application presents two roles: **customer** and **manager**.

### MySQL Database Setup

In order to run this application, you should have the MySQL database already set up on your machine. If you don't, visit the [MySQL installation page](https://dev.mysql.com/doc/refman/5.6/en/installing.html) to install the version you need for your operating system. Once you have MySQL isntalled, you will be able to create the *bamazon* database and the *products* table with the SQL code found in [bamazon.sql](bamazon.sql). You can use my .sql file, run the statements and then you will be ready to go running either the customer or manager interface.

### To initiate this app
To run the app please follow the steps below:

	git clone git@github.com:bretgithub/bamazon.git
	cd bamazon
	npm install
	open bamazon.sql (then run the statements)
	add your your db user and pw info in bamazonCustomer.js and bamazonManager.js
	
### Customer Role

The customer intrerface allows the user to view inventory of store items by:
Item ID
Product name
Department
Cost
Quantity

The user is prompted to either buy things or get out, if they select to buy something then the user can enter the item ID and desired quantity to purchase.

If the user selects a quantity that is more than what is in stock the user is alerted and re-enters the interface to make a new selection of what to buy and how many.

After user makes a valid purchase the database removes the amount from stock and returns to the user the total price ofn their purchase. 

### To initiate client interface

	node bamazonCustomer.js

### Manager Role

The manager interface presents a list of three options, as below. 

	? Please select an option: (Use arrow keys)
	❯ View Products for Sale 
	  View Low Inventory 
	  Add New Product
	  
The **View Products** option allows the user to view store products displaying:
Item ID
Product name
Department
Cost
Quantity in stock

The **View Low Inventory** option shows the user the items which currently have fewer than 50 units available. From there they can add to inventory from the list of products that are low inventory. The user can repeat this until there are no items in low inventory or they choose to exit

The **Add New Product** option allows the user to enter details about a new product which will be entered into the database upon completion of the form.

### To initiate manager interface

	node bamazonManager.js
	
### Demo Videos

Click the links below to view and download bamazon customer interface video or bamazon manager interface video

* [bamazon customer](clientBamazon.webm)

* [bamazon manager](managerBamazon.webm)
	
### Roadmap

I'd like to continue to develop this to allow the manager to add stock to inventory if not low, and add the supervisor role which will focuses on joining tables. 


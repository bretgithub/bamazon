let mySQL = require("mysql");
let inquirer = require("inquirer");

// establishing connection to the database
let connection = mySQL.createConnection({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "admin",
  database: "bamazon_db"
});

// connecting and kicking off the app
connection.connect(function(err, result) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  managerPrompt();
});

// prompting manager to make selection on which action to take
function managerPrompt() {
  // Prompt the manager to select an option
  console.log("Welcome to Bamazon");
  console.log(
    "As a manager, view products, add to inventory, and add products"
  );
  console.log("------------------");
  // select from the following which then runs functions to take an action
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: "Please select an option:",
        choices: [
          "View Product Inventory",
          "View Low Inventory",
          "Add New Product"
        ],
        filter: function(val) {
          if (val === "View Product Inventory") {
            return "viewInventory";
          } else if (val === "View Low Inventory") {
            return "lowInventory";
          } else if (val === "Add New Product") {
            return "newProduct";
          }
        }
      }
    ])
    .then(function(input) {
      if (input.option === "viewInventory") {
        viewInventory();
      } else if (input.option === "lowInventory") {
        lowInventory();
      } else if (input.option === "newProduct") {
        addNewProduct();
      }
    });
}

// view current inventory
function viewInventory() {
  connection.query("SELECT * FROM products", function(err, result) {
    if (err) {
      console.log("ERROR in retrieving: " + err);
      connection.end();
    }
    console.table(result);
    // end the database connection and we are done!
    connection.end();
  });
}

// view low inventory where stock_quantity < 50
function lowInventory() {
  lowQty = 50;
  connection.query(
    `SELECT * FROM products WHERE stock_quantity <= ?`,
    [lowQty],
    function(err, result) {
      if (err) {
        console.log("Error in connecting :" + err);
        connection.end();
      } else if (result.length === 0) {
        console.log("No items are low inventory");
        // end the database connection and we are done!
        connection.end();
      } else {
        console.table(result);
        console.log(typeof result);
        console.log("These are low quantity, time to restock!");
        // pass the result of low inventory to restock as an argument
        restock(result);
      }
    }
  );
}

// allows user to restock the results from lowInventory
function restock(lowStockArray) {
  //var ids = lowStockArray.map(each => `${each.item_id}`);
  let ids = lowStockArray.map(each => "" + each.item_id + "");
  // ids = JSON.parse(ids);
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please pick which product you'd like to restock",
        choices: ids,
        name: "which"
      },
      {
        type: "number",
        message: "How much would you like to restock",
        name: "qty"
      }
    ])
    // update quantity od selection
    .then(function(answers) {
      connection.query(
        `UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?`,
        [answers.qty, { item_id: answers.which }]
      );
    })
    // give user ability to restock more or exit
    .then(function() {
      inquirer
        .prompt([
          {
            type: "confirm",
            message: "Would you like to restock another item?",
            name: "restock_more"
          }
        ])
        .then(function(answers) {
          if (answers.restock_more) {
            lowInventory();
          } else if (!answers.restock_more) {
            console.log("Take a break");
            // end the database connection and we are done!
            connection.end();
          }
        });
    });
}

// add a new product to the database
function addNewProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "Please enter the new product name."
      },
      {
        type: "input",
        name: "department_name",
        message: "Which department does the new product belong to?"
      },
      {
        type: "input",
        name: "price_to_customer",
        message: "What is the price per unit?"
      },
      {
        type: "input",
        name: "stock_quantity",
        message: "How many items are in stock?"
      }
    ])
    .then(function(input) {
      console.log(
        "Adding New Item: \n    product_name = " +
          input.product_name +
          "\n" +
          "    department_name = " +
          input.department_name +
          "\n" +
          "    price = " +
          input.price_to_customer +
          "\n" +
          "    stock_quantity = " +
          input.stock_quantity
      );
      // Create the insertion query string
      let queryStr = "INSERT INTO products SET ?";

      // Add new product to the database
      connection.query(queryStr, input, function(error, results, fields) {
        if (error) throw error;
        console.log(
          "New product has been added to the inventory under Item ID " +
            results.insertId +
            "."
        );
        console.log(
          "\n---------------------------------------------------------------------\n"
        );
        // end the database connection and we are done!
        connection.end();
      });
    });
}

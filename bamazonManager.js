let mySQL = require("mysql");
let inquirer = require("inquirer");

let connection = mySQL.createConnection({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "admin",
  database: "bamazon_db"
});

connection.connect(function(err, result) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  viewProducts();
  // return result;
});

function viewProducts() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please select: ",
        choices: ["View products", "Take a break"],
        name: "choice"
      }
    ])
    .then(function(result) {
      if (result.choice === "Take a break") {
        console.log("Take a walk, grab a coffee");
        connection.end();
      }

      if (result.choice === "View products") {
        bamazonManager();
      }
    });
}

function bamazonManager() {
  console.log("Welcome to Bamazon");
  console.log("As a manager, view and adjust inventory");
  console.log("------------------");
  connection.query("SELECT * FROM products", function(err, result) {
    if (err) {
      console.log("ERROR in retrieving: " + err);
      connection.end();
    }
    console.table(result);
    lowInventory();
  });
}

function lowInventory() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please select: ",
        choices: ["View low inventory", "Take a break"],
        name: "choice"
      }
    ])
    .then(function(result) {
      if (result.choice === "Take a break") {
        console.log("Take a walk, grab a coffee");
        connection.end();
      }

      if (result.choice === "View low inventory") {
        checkLowInventory();
      }
    });
}

function checkLowInventory() {
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
        connection.end();
      } else {
        console.table(result);
        console.log(typeof result);
        restock(result); //invoking restock and passing result as argument
      }
    }
  );
}

function restock(lowStockArray) {
  // lowStockArray becomes that argument of result above
  //console.log(lowStockArray)
  //var ids = lowStockArray.map(each => `${each.item_id}`);
  //console.log(ids);
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
    .then(function(answers) {
      connection.query(
        `UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?`,
        [answers.qty, { item_id: answers.which }]
      );
    })
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
            checkLowInventory();
          } else if (!answers.restock_more) {
            console.log("Take a break");
            connection.end();
          }
        });
    });
}

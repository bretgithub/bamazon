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
    });
}

function restock(lowStockArray) {
  // lowStockArray becomes that argument of result above
  //console.log(lowStockArray)
  //var ids = lowStockArray.map(each => `${each.item_id}`);
  //console.log(ids);
  var ids = lowStockArray.map(each => "" + each.item_id + "");
  // ids = JSON.parse(ids);

  inquirer
    .prompt([
      {
        name: "which",
        type: "list",
        choices: ids
      }
    ])
    .then(function(answers) {
      console.log(answers);
    });
  // connection.query("SELECT * FROM product", function(err, result) {
  //   if (err) throw err;
  //   array = result;
  //   let low = [];
  //   for (i = 0; i < array.length; i++) {
  //     console.log(array[i].item_name);
  //     console.log(array[i].current_bid);
  //     bidItems.push(array[i].item_name);
  //     inquirer.prompt([
  //       {
  //         type: "list"
  //       }
  //     ]);
  //   }
  // });
}

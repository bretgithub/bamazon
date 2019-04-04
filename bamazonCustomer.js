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

// connect and start the app
connection.connect(function(err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  bamazon();
});

// gives user the welcome and displays products, calls menu function
function bamazon() {
  console.log("Welcome to BAMAZON");
  console.log("Items up for sale");
  console.log("------------------");
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) {
      console.log("Error with grabbing results: " + err);
    }
    console.table(results);
    menu();
  });
}

// allow user to get out or buy stuff
function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please select: ",
        choices: ["Get out", "Buy stuff"],
        name: "choice"
      }
    ])
    .then(function(results) {
      if (results.choice === "Get out") {
        connection.end();
      } else if (results.choice === "Buy stuff") {
        buyStuff();
      }
    });
}

// allows user to buy an item
function buyStuff() {
  inquirer
    .prompt([
      {
        type: "number",
        message: "Enter the ID of the product you want to buy",
        name: "item"
      },
      {
        type: "number",
        message: "Enter the quantity of the product you want to buy",
        name: "quantity"
      }
    ])
    // grabs item and qty
    .then(function(answers) {
      connection.query(
        `SELECT * FROM products WHERE ?`,
        { item_id: answers.item },
        function(err, result) {
          if (err) {
            console.log("Error with checking item ID: " + err);
          }
          // check if valid qty
          if (answers.quantity <= result[0].stock_quantity) {
            let newQty = result[0].stock_quantity - answers.quantity;
            let total = answers.quantity * result[0].price_to_customer;
            connection.query(
              // updating based on selection
              `UPDATE products SET ? WHERE ?`,
              [{ stock_quantity: newQty }, { item_id: answers.item }],
              function(err, result) {
                if (err) {
                  console.log("Error with updating table: " + err);
                } else {
                  console.log(
                    // returns total to the user
                    `We placed your order, you have been charged $${total}, it should arrive in 2 days, thank you for being a Prime member`
                  );
                  // end connection to the database, we are done
                  connection.end();
                }
              }
            );
            console.log("Plenty in stock");
          } else {
            console.log(
              // not enough in stock, returns user to make selection
              "We do not have enough, we have " +
                result[0].stock_quantity +
                " in stock, please select again"
            );
            menu();
          }
        }
      );
    });
}

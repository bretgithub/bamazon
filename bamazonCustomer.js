let mySQL = require("mysql");
let inquirer = require("inquirer");

let connection = mySQL.createConnection({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "admin",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  bamazon();
});

// when connected, do not need to call connection from within  query because I am connected, but it will work by calling function within

function bamazon() {
  console.log("Welcome to BAMAZON");
  console.log("Items up for sale");
  console.log("------------------");
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) {
      console.log("Error with grabbing results: " + err);
    }

    console.table(results);
    // for (var i = 0; i < results.length; i++) {
    // console.log(
    //   results[i].item_id +
    //     " | " +
    //     results[i].product_name +
    //     " | Unit Price: $" +
    //     results[i].price_to_customer +
    //     " | Units Remaining: " +
    //     results[i].stock_quantity
    // );
    // console.log("------------------");
    // }
    menu();
  });
}

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

    // if (bidAmount.bid > product.current_bid) {
    //   connection.query(
    //     "UPDATE product SET ? WHERE ?",
    //     [
    .then(function(answers) {
      connection.query(
        `SELECT * FROM products WHERE ?`,
        { item_id: answers.item },
        function(err, result) {
          if (err) {
            console.log("Error with checking item ID: " + err);
          }
          if (answers.quantity <= result[0].stock_quantity) {
            let newQty = result[0].stock_quantity - answers.quantity;
            let total = answers.quantity * result[0].price_to_customer;
            connection.query(
              `UPDATE products SET ? WHERE ?`,
              [{ stock_quantity: newQty }, { item_id: answers.item }],
              function(err, result) {
                if (err) {
                  console.log("Error with updating table: " + err);
                } else {
                  console.log(
                    `We placed your order, you have been charged $${total}, it should arrive in 2 days, thank you for being a Prime member`
                  );
                  connection.end();
                }
              }
            );
            console.log("Plenty in stock");
          } else {
            console.log(
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

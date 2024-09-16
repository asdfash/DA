/**
 * RANDOM SCRIPTS TO TEST SHIT
 * Comment and uncomment as neccsasry
 */

const mysql = require("mysql2/promise");
const argon2 = require("argon2");

async function test() {
  const connection = await mysql.createConnection({
    host: process.env.SQLHOST,
    port: process.env.SQLPORT,
    user: process.env.SQLUSER,
    database: process.env.SQLDB,
    password: process.env.SQLPW,
  });

  // SELECT query
  try {
    [];
    const email = "test@test.com";
    const pw = "test";
    const [results, fields] = await connection.execute("SELECT * FROM `accounts` WHERE `email` = ? AND `password` = ?", [email, pw]);
    console.log("---------");
    console.log(results); // results contains rows returned by server
    console.log("---------");
    console.log(fields); // fields contains extra meta data about results, if available
  } catch (err) {
    console.log(err);
  }
  /**
   * BREAKPOINT
   */
  // //argon2 (hashing) tests
  // // NOTE: npm install --save argon2 first
  // try {
  //   const hash = await argon2.hash("test", { type: argon2.argon2d });
  //   console.log(hash);
  // } catch (err) {
  //   console.log(err);
  // }
}

test();

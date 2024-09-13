/**
 * RANDOM SCRIPTS TO TEST SHIT
 * Comment and uncomment as neccsasry
 */

const mysql = require("mysql2/promise");
const argon2 = require("argon2");

async function test() {
  // // MYSQL query test
  // const connection = await mysql.createConnection({
  //   host: process.env.SQLHOST || 'localhost',
  //   port: process.env.SQLPORT || 3306,
  //   user: process.env.SQLUSER || 'root',
  //   database: process.env.SQLDB || 'db',
  //   password: process.env.SQLPW || 'P@ssw0rd123',
  // });
  // // SELECT query
  // try {
  //   const email = "test@test.com";
  //   const pw = "test";
  //   const [results, fields] = await connection.execute("SELECT `accounts` WHERE `email` = ? AND `password` = ?)", [email, pw]);
  //   console.log("---------");
  //   console.log(results); // results contains rows returned by server
  //   console.log("---------");
  //   console.log(fields); // fields contains extra meta data about results, if available
  // } catch (err) {
  //   console.log(err);
  // }
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

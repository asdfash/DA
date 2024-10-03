import mysql from "mysql2/promise";

/**
 * connect to database
 *NOTE: check individual controllers and middleware for queries
 */
export const db = await mysql.createConnection({
  host: process.env.SQLHOST,
  port: process.env.SQLPORT,
  user: process.env.SQLUSER,
  database: process.env.SQLDB,
  password: process.env.SQLPW,
});
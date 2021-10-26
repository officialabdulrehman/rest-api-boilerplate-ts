import dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];

if (!MONGODB_URI) {
  if (prod) {
    console.log("No mongo connection string. Set MONGODB_URI environment variable.");
  } else {
    console.log("No mongo connection string. Set MONGODB_URI_LOCAL environment variable.");
    console.log(process.env["MONGODB_URI_LOCAL"]);
  }
  process.exit(1);
}
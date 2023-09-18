
const { createConnection } = require("typeorm");

async function createDatabaseConnection() {
  try {
    const connection = await createConnection();
    console.log("Connected to MySQL database");
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

module.exports = createDatabaseConnection;





// const {DataSource  } = require("typeorm");
// const admins = require("../Model/AdminRegModel");
// const profiles = require("../Model/profileModel.js");

// const dataConnect = new  DataSource({
//     type: "mysql",
//     host: "localhost",
//     port: 3306, // Default MySQL port
//     username: "root", // Replace with your MySQL username
//     password: "kome12345", // Replace with your MySQL password
//     database: "chamaccess",
//     entities: [admins, profiles], // Make sure to import User from the correct path
//     synchronize: false, // This can be set to false for production
//     logging: true,
// });

// module.exports = dataConnect


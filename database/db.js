const {DataSource  } = require("typeorm");
const Admins = require("../Model/AdminRegModel");
const Profiles = require("../Model/profileModel");

const dataConnect = new  DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306, // Default MySQL port
    username: "root", // Replace with your MySQL username
    password: "kome12345", // Replace with your MySQL password
    database: "chamaccess",
    entities: [Admins, Profiles], // Make sure to import User from the correct path
    synchronize: true, // This can be set to false for production
    logging: false,
});

module.exports = dataConnect


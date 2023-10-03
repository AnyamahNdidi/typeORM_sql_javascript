const express = require("express");
const cors = require("cors");
const adminRouter = require("./router/adminRouter");
const createRouter = require("./router/categoryRouter")
const brandRouter = require("./router/brandRouter")
const productRouter = require("./router/productRouter")
const morgan = require('morgan')


const MainApp = (app) => {
    
    app.use(express.json()).use(cors())
        .use("/api/v1", adminRouter)
        .use("/api/v1", createRouter)
        .use("/api/v1", brandRouter)
        .use("/api/v1", productRouter)
        .use(morgan("dev"))
        .get("/", (req, res) => {
        
            res.status(200).json({
                message:"api is ready"
            })
    })  
} 

module.exports = {
 MainApp,

};
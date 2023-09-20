const express = require("express");
const cors = require("cors");
const adminRouter = require("./router/adminRouter");
const createCatogory = require("./router/categoryRouter")


const MainApp = (app) => {
    
    app.use(express.json()).use(cors())
        .use("/api/v1", adminRouter)
        .use("/api/v1", createCatogory)
        .get("/", (req, res) => {
        
            res.status(200).json({
                message:"api is ready"
            })
    })  
} 

module.exports = {
 MainApp,

};
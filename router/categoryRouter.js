const express = require("express")
const router = express.Router()



const { createCategory} = require("../controller/categoryController")

router.route("/create-category/:adminId").post(createCategory)


module.exports = router
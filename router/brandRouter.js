const express = require("express")
const router = express.Router()
const upload = require("../utils/multer");
const verifty = require("../utils/verifyToken")


const { createBrand } = require("../controller/brandContoller")

router.route("/create-brand/:adminId").post(upload.fields([{name: "images", maxCount: 5}]), createBrand)

module.exports = router
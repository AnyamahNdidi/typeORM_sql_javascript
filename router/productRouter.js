const express = require("express")
const router = express.Router()
const upload = require("../utils/multer");
const verifty = require("../utils/verifyToken")


const { createProd, updateProd, getAllProduct, deleteProduct, getAllOroductByAdmin,getProductById} = require("../controller/productController")

router.route("/create-product/:adminId").post(upload.fields([{ name: "images", maxCount: 5 }]), createProd)
router.route("/all-product").get( getAllProduct)
router.route("/single-product/:productId").get( getProductById)
router.route("/delete-product/:productId").delete( deleteProduct)
router.route("/product-by-admin/:adminId").get( getAllOroductByAdmin)
router.route("/update-product/:productId").put(upload.fields([{ name: "images", maxCount: 5 }]), updateProd)

module.exports = router
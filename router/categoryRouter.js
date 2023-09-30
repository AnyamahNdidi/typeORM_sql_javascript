const express = require("express")
const router = express.Router()
const verifty = require("../utils/verifyToken")



const { createCategory, getAllCategory, getAllCategorybyAdmin,updateCatagory,deleteCategory} = require("../controller/categoryController")

router.route("/create-category/:adminId").post(createCategory)
router.route("/all-category").get( getAllCategory)
router.route("/category-by-admin/:adminId").get( getAllCategorybyAdmin)

router.route("/update-category/:categoryId").put( updateCatagory)
router.route("/delete-category/:categoryId").delete(verifty, deleteCategory)


module.exports = router
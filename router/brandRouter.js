const express = require("express")
const router = express.Router()
const upload = require("../utils/multer");
const verifty = require("../utils/verifyToken")


const { createBrand, updateBrand,deleteBrand, getAllBrand, getAllBrandByAdmin, getBrandById } = require("../controller/brandContoller")

router.route("/create-brand/:adminId").post(upload.fields([{ name: "images", maxCount: 5 }]), createBrand)
router.route("/delete-brand/:brandId").delete(verifty, deleteBrand)
router.route("/all-brand").get(verifty, getAllBrand)
router.route("/single-brand/:brandId").get(verifty, getBrandById)
router.route("/brand-by-admin/:adminId").get( verifty, getAllBrandByAdmin)
router.route("/update-brand/:brandId").put(verifty, upload.fields([{ name: "images", maxCount: 5 }]), updateBrand)

module.exports = router
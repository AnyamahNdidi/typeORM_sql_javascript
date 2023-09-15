const express = require("express")
const router = express.Router()
const upload = require("../utils/multer");



const { regAdmin, loginUser,settingsProfile,getOneUser} = require("../controller/adminReg")

router.route("/register-admin").post(regAdmin)
router.route("/login-admin").post(loginUser)
router.route("/single-admin/:id").get(getOneUser)

router.route("/account-settings/:adminId").put(  upload.fields([{name: "avatar", maxCount: 1}]), settingsProfile)

module.exports = router
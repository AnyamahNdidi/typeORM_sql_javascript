const express = require("express")
const router = express.Router()
const upload = require("../utils/multer");
const verifty = require("../utils/verifyToken")


const { regAdmin, loginUser,settingsProfile,getOneUser,deActivateAccount, ActivateAccount, changePaword} = require("../controller/adminReg")

router.route("/register-admin").post(regAdmin)
router.route("/login-admin").post(loginUser)
router.route("/single-admin/:id").get(getOneUser)
router.route("/deactivate-account").post(verifty,deActivateAccount)
router.route("/activate-account").post(verifty,ActivateAccount)
router.route("/change-password/:id").patch(changePaword)

router.route("/account-settings/:adminId").put(  upload.fields([{name: "avatar", maxCount: 1}]), settingsProfile)

module.exports = router
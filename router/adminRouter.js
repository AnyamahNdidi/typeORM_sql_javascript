const express = require("express")
const router = express.Router()


const { regAdmin, loginUser } = require("../controller/adminReg")

router.route("/register-admin").post(regAdmin)
router.route("/login-admin").post(loginUser)

module.exports = router
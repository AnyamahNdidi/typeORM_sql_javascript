const jwt = require("jsonwebtoken")

const TokenGenerator = (data) => {
    return jwt.sign(data, "thisisthesecrect", {expiresIn:"10m"})
}

 const  refreshToken = (data) => {
     return jwt.sign(data, "refreshsecrect", {expiresIn:"3m"})
}

module.exports = {
    TokenGenerator,
    refreshToken
}
const jwt  = require("jsonwebtoken")

const verifty = async (req, res, next) => {
    let token;
    if (req.headers.authorization)
    {
        try
        {
            token = req.headers.authorization.split(" ")[1]
            jwt.verify(token, "thisisthesecrect", (err, decodecToken) => {
                   if (err) {
                    return res.status(403).json({ message: 'Failed to authenticate token, Token expired' });
                    }
                    // Set the decoded token in the request object for later use
                    req.user = decodecToken;
                    next();
            })
            
        } catch (error)
        {
              return res.status(400).json({
                message:`not authorization token failed ${error.message}`
            })
        }
        
    }
    if (!token)
    {
       return res.status(401).json({message:"not authorized, no token provided"})
    }
}

module.exports = verifty
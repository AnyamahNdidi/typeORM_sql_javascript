const Admins = require("../Model/AdminRegModel")
const { TokenGenerator, refreshToken } = require("../utils/tokenGeneratoe")

/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       required:
 *         - fullname
 *         - email
 *         - password
 *       properties:
 *         fullname:
 *           type: string
 *           description: The user first name
 *         password:
 *           type: string
 *           description: email stack
 *         email:
 *           type: string
 *           description: The prefeered email
 *       example:
 *         fullname: john
 *         password: 12345
 *         email: johnjames@gmail.com
 */





/**
 * @swagger
 * /api/v1/register-admin:
 *   post:
 *      description: Used to register user
 *      tags:
 *          - Create User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/users'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */


const regAdmin = async (req, res) => {
     try
    {
         const { fullname, email, password } = req.body;
            
        if (!fullname || ! email || !password)
        {
            return res.status(400).json({message:"please enter all field"})
        }

        const usesExist = await Admins.findOneBy({ email:email })
            if (usesExist)
            {
                return res.status(401).json({message:"email already exist"})
            }
        
        const userData = await Admins.create({ fullname, email, password }).save()
        
        res.status(200).json({
            message: "created",
            data: userData,
        })
        
    } catch (error)
    {
        return res.status(400).json({
            message:"An Error occure" + error
        })
    }
}





/**
 * @swagger
 * components:
 *   schemas:
 *     login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           description: email stack
 *         email:
 *           type: string
 *           description: The prefeered email
 *       example:
 *         email: johnjames@gmail.com
 *         password: 12345
 *        
 */





/**
 * @swagger
 * /api/v1/login-admin:
 *   post:
 *      description: Used to login admin
 *      tags:
 *          - Login Admin
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/login'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */


const loginUser = async (req, res) => {
    try
    {
        const { email, password} = req.body
        const checkUser = await Admins.findOneBy({ email });
        
        if (checkUser)
        {
            const matchPassword = await checkUser.checkPassword(password)

            if (matchPassword)
            {
                const token= TokenGenerator({
                    id: checkUser.id,
                    email: checkUser.email,
                    verified:true
                })

                const tokenRefresh = refreshToken({
                    id: checkUser.id,
                    email: checkUser.email,
                    verified:true
                })

                return res.status(200).json({
                    message: "login successfull",
                    data: {
                        checkUser, token, tokenRefresh
                    }
                })
                
            } else
            {
               return res.status(200).json({ message:"incorrect password" })  
            }
        } else
        {
            return res.status(200).json({ message:"user not found" })
        }

        
        
    } catch (error)
    {
         return res.status(400).json({
            message:"An Error occure" + error
        })
    }
}

module.exports = {
    regAdmin,
    loginUser
}
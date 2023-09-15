const Admins = require("../Model/AdminRegModel")
const profiles = require("../Model/profileModel")
const { TokenGenerator, refreshToken } = require("../utils/tokenGeneratoe")
const fs = require("fs")

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
 *         password: "user22"
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
         
         const profileData = new profiles()
         profileData.adminId = userData.id
         profileData.id = userData.id

         await profileData.save()
        
         console.log(userData.id)
        res.status(200).json({
            message: "created",
            data: {admin:userData, profiles:profileData},
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
 *         password: "user22"
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






/**
 * @swagger
 * components:
 *   schemas:
 *     accountsettings:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: user first Name
 *         lastName:
 *           type: string
 *           description: user Last name
 *         email:
 *           type: string
 *           description: admin email address
 *         phoneNum:
 *           type: string
 *           description: admin phone number
 *         address:
 *           type: string
 *           description: admin address
 *         DateOfBirth:
 *           type: string
 *           description: Date of Birth
 *         avatar:
 *           type: string
 *           format: binary
 *           description: the imag file
 *       example:
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "johndoe@example.com"
 *         phoneNum: "1234567890"
 *         address: "123 Main St"
 *         DateOfBirth: "1990-01-01"
 *         avatar: "file.jpeg"
 */






/**
 * @swagger
 *  /api/v1/account-settings/{adminId}:
 *  put:
 *    summary: end point for setting account
 *    tags: [Create User]
 *    parameters:
 *      - in: path
 *        name: adminId
 *        schema:
 *          type: string
 *          format: varchar
 *        required: true
 *        description: This is the user id(admin) to set up account
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/accountsettings'
 *    responses:
 *      200:
 *        description: The profile has been updated
 *      404:
 *        description: The profile was not found
 *      500:
 *        description: Some error happened
 */



const settingsProfile = async(req, res) => {
    try
    {
        const { firstName, lastName, email, phoneNum, address, DateOfBirth } = req.body
        
       
        const { adminId } = req.params; // Get the adminId from the request parameters
       

        // Check if the admin exists
        const admin = await Admins.findOne({ where: { id: adminId } });

        if (!admin)
        {
            return res.status(404).json({ message: "Admin not founded" });
        }

        admin.email = email || admin.email
        admin.fullname = `${firstName} ${lastName}` || admin.fullname

        await admin.save()

        // Update the profile fields
        const profile = await profiles.findOne({ where: { adminId: adminId } });

        if (!profile)
        {
            return res.status(404).json({ message: "Profile not found" });
        }

        if (req.files["avatar"])
        {
              const newAvatarFilename = req.files["avatar"][0].filename;

            // Delete the old avatar file
            if (profile.avatar) {
                const oldAvatarPath = `uploads/${profile.avatar}`;
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath);
                }
            }

            // Update the profile's avatar with the new filename
            profile.avatar = newAvatarFilename;
    }


        profile.firstName = firstName || profile.firstName;
        profile.lastName = lastName || profile.lastName;
        profile.email = email || profile.email;
        profile.address = address || profile.address;
        profile.DateOfBirth = DateOfBirth || profile.DateOfBirth;
        profile.phoneNum = phoneNum || profile.phoneNum;
       
        

        // Save the updated profile
        await profile.save();

        res.status(200).json({
            message: "Profile updated",
            data: profile,
        });
        
    } catch (error)
    {
         return res.status(400).json({
            message:"An Error occure" + error
        })
    }
}


/**
 * @swagger
 * /api/v1/single-admin/{id}:
 *   get:
 *     summary: Get a single admin and its profile
 *     tags: [Create User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The properties id
 *     responses:
 *       200:
 *         description: The user description by id
 *       404:
 *         description: The student was not found
 */

const getOneUser = async (req, res) => {
    try
    {
            const { id } = req.params;

        // Find a single user by id
        const user = await Admins.findOne({ where: { id: id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the profile associated with the user
        const profile = await profiles.findOne({ where: { adminId: id } });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Assign the profile to the user object
        user.profile = profile;

        res.status(200).json({
            message: "User found",
            data: user,
        });
        
    } catch (error)
    {
        return res.status(400).json({
            message:"An Error occure" + error
        })
    }
}

module.exports = {
    regAdmin,
    loginUser,
    settingsProfile,
    getOneUser
}
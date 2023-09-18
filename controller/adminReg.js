const Admins = require("../Model/AdminRegModel")
const profiles = require("../Model/profileModel");
const { use } = require("../router/adminRouter");
const { TokenGenerator, refreshToken } = require("../utils/tokenGeneratoe")
const bcrypt = require('bcrypt');
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
        
         const userData = await Admins.create({ fullname, email, password,isActive:1,verified:1 }).save()
         
         const profileData = new profiles()
         profileData.adminId = userData.id
         profileData.id = userData.id
         userData.profile = profileData 

         await profileData.save()
        
         console.log(userData.id)
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
                    verified:checkUser.verified
                })

                console.log("show token",token)

                const tokenRefresh = refreshToken({
                    id: checkUser.id,
                    email: checkUser.email,
                    verified:checkUser.verified
                })
                 const { password, verified, ...info } = checkUser
                return res.status(200).json({
                    message: "login successfull",
                    data: {
                        info, token, tokenRefresh
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

        if (admin.isActive === 0)
        {
            return res.status(404).json({ message: "Account has been deActivated" });
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/deactivate-account:
 *   post:
 *     security:
 *       - BearerAuth: [] # Use your actual security scheme name here
 *     summary: Endpoint to deactivate an account
 *     tags: [user]
 *     responses:
 *       200:
 *         description: The account has been deactivated successfully
 *       401:
 *         description: Unauthorized - Bearer token is missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Some error happened
 */



const deActivateAccount = async (req, res) => {
    try
    {
        console.log("seen token", req.user.id)
        const adminUser = await Admins.findOne({ where: { id: req.user.id } });

        console.log("this is user data", adminUser)
      if (!adminUser) {
      return res.status(401).json({
        message: "user not found",
      });
    }

   // Store the current password value from the database
    const passwordInDatabase = adminUser.password;

    // Update only the fullName (you can add more fields to update here)
        adminUser.isActive = 0;
        // adminUser.password="123456"
    console.log("compage", passwordInDatabase)
    // Revert the password field to its original value in the database
        
        console.log("look", adminUser)
   
    

    // Save the user with the updated fullName
    await adminUser.save();
    
    console.log("this is user data", adminUser.password);
 
        return res.status(210).json({
            message:"account has been deactivated successfully"
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
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/activate-account:
 *   post:
 *     security:
 *       - BearerAuth: [] # Use your actual security scheme name here
 *     summary: Endpoint to deactivate an account
 *     tags: [user]
 *     responses:
 *       200:
 *         description: The account has been deactivated successfully
 *       401:
 *         description: Unauthorized - Bearer token is missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Some error happened
 */

const ActivateAccount = async (req, res) => {
    try
    {
        console.log("seen token", req.user.id)
        const adminUser = await Admins.findOne({ where: { id: req.user.id } });

        console.log("this is user data", adminUser)
      if (!adminUser) {
      return res.status(401).json({
        message: "user not found",
      });
    }

   // Store the current password value from the database
    const passwordInDatabase = adminUser.password;

        adminUser.isActive = 1;
  
    console.log("compage", passwordInDatabase)
    // Revert the password field to its original value in the database
        
        console.log("look", adminUser)
   
    

    // Save the user with the updated fullName
    await adminUser.save();
    
    console.log("this is user data", adminUser.password);
 
        return res.status(210).json({
            message:"account has been activated successfully"
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
 *     editUsersPassword:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         image:
 *           type: string
 *           description: input the new user password
 *       example:
 *         password: "password"
 */



/**
 * @swagger
 *  /api/v1/change-password/{id}:
 *  patch:
 *    summary: Update user password
 *    tags: [users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/editUsersPassword'
 *    responses:
 *      200:
 *        description: password has been updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/editUsersPassword'
 *      404:
 *        description: The profile was not found
 *      500:
 *        description: Some error happened
 */



const changePaword = async (req, res) => {
    try
    {
        const { password } = req.body;
        const { id } = req.params;
        const user = await Admins.findOne({ where: { id: id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword; // Update the password with the hashed one
        await user.save();
        
        return res.status(200).json({
			message: "password has been changed sucessfully",
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
    getOneUser,
    deActivateAccount,
    changePaword,
    ActivateAccount
}

const product = require("../Model/productModel")
const { getRepository } = require('typeorm');
const categories = require("../Model/categoryModel")
const Admins = require("../Model/AdminRegModel")


/**
 * @swagger
 * components:
 *   schemas:
 *     createCategory:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - parent
 *         - desc
 *       properties:
 *         name:
 *           type: string
 *           description: category name
 *         slug:
 *           type: string
 *           description: email stack
 *         parent:
 *           type: string
 *           description: The prefeered email
 *         desc:
 *           type: string
 *           description: The prefeered email
 *       example:
 *         name: mobile phones
 *         slug: redadys
 *         parent: electronics
 *         desc: fruits
 *        
 */


/**
 * @swagger
 * /api/v1/create-category/{adminId}:
 *   post:
 *      summary: endpoint for creating category
 *      tags: [create category]
 *      parameters:
 *        - in: path
 *          name: adminId
 *          schema:
 *            type: string
 *          required: true
 *          description: The admin id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/createCategory'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */





const createCategory = async (req, res) => {
    try
    {
        const { name, slug, parent, desc } = req.body
          if (!name || ! slug || !parent || !desc)
        {
            return res.status(400).json({message:"please enter all field"})
        }
        const { adminId } = req.params; 
         const admin = await Admins.findOne({ where: { id: adminId } });

    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new category instance
        const category = new categories();
        category.name = name;
        category.slug = slug;
        category.parent = parent;
        category.description = desc;
        category.order = 0;


        category.user = admin.id;

    // Save the category to the database
        await category.save();
         const { user,  ...info } = category
    // Return a success response
    res.status(201).json({ message: 'Category created successfully', info, admin:admin });     
    } catch (error)
    {
         return res.status(400).json({
            message:"An Error occure dfgdf" + error
        })
    }
}




/**
 * @swagger
 * /api/v1/all-category:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for retrieving all categories
 *     tags: [create category]
 *     responses:
 *       200:
 *         description: The list of the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */


const getAllCategory = async(req, res) => {
    try
    {

        const catDataall = []
        const allCategory = await categories.find()

      for (const catData of allCategory) {
            const getUser = await Admins.findOne({ where: { id: catData.user } });

            const catObj = {
                id: catData.id,
                name:catData.name,
                slug: catData.slug,
                parent: catData.parent,
                order: catData.order,
                description: catData.description,
                product:catData.product,
                brand:catData.brand,
                user: {
                    fullName: getUser ? getUser.fullname : null, // Handle cases where user is not found
                },
            };

            catDataall.push(catObj);
        }

          return res.status(200).json({
            message: "all category",
            data: catDataall,
        })
        
    } catch (error)
    {
         return res.status(400).json({
            message:"An Error occure dfgdf" + error
        })
    }
}

/**
 * @swagger
 * /api/v1/category-by-admin/{adminId}:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for retrieving all category posted by a specific admin
 *     tags: [create category]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: The properties id
 *     responses:
 *       200:
 *         description: The list of the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

const getAllCategorybyAdmin = async (req, res) => {
     try
    {

        
         const dataOne = []
         const adminCategory = await categories.find()
         for (const adminData of adminCategory)
         {
            //  const allCategoryByAdmin = await categories.find({ where: { user: req.params.adminId } });
             if (adminData.user === req.params.adminId)
             {
                const onjData = {
                    id: adminData.id,
                    slug: adminData.slug,
                    parent:adminData.parent,
                    order: adminData.order,
                    description: adminData.description,
                    product: adminData.product,
                    brands: adminData.brand
                    
                }
                dataOne.push(onjData)
             }
            
         }
         
         if (dataOne.length === 0)
         {
             return res.status(404).json({
                 message:"this admin has no categories posted"
            }) 
         }          
         return  res.status(200).json({
            message: "category by admin",
            data: dataOne,
        })
        
    } catch (error)
    {
         return res.status(400).json({
            message:"An Error occure dfgdf" + error
        })
    }
}



/**
 * @swagger
 *  /api/v1/update-category/{categoryId}:
 *  put:
 *    summary: end point to update category
 *    tags: [create category]
 *    parameters:
 *      - in: path
 *        name: categoryId
 *        schema:
 *          type: string
 *        required: true
 *        description: The category id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/createCategory'
 *    responses:
 *      200:
 *        description: The category has been updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/createCategory'
 *      404:
 *        description: The category was not found
 *      500:
 *        description: Some error happened
 */




const updateCatagory = async (req, res) => {
    try
    {
        const { name, slug, parent, desc } = req.body
        const { categoryId } = req.params;
         const category = await categories.findOne({ where: { id: categoryId } });

        if (!category)
        {
            return res.status(404).json({ message: "No category with this id" });
        }
        category.name = name || category.name;
        category.slug = slug || category.slug;
        category.parent = parent || category.parent
        category.description = desc || category.description

        await category.save();

        const {user, ...info} = category

         res.status(200).json({
            message: "catagory updated sucessfully",
            data: info,
        });

        
    } catch (error)
    {
         return res.status(400).json({
            message:"An Error occure dfgdf" + error
        })
    }
}


/**
 * @swagger
 * /api/v1/delete-category/{categoryId}:
 *   delete:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for retrieving all category posted by a specific admin
 *     tags: [create category]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category id
 *     responses:
 *       200:
 *         description: delete a single category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

const deleteCategory = async (req, res) => {
    try {
    
        const { categoryId } = req.params;

        const category = await categories.findOne({ where: { id: categoryId } });

        if (!category) {
            return res.status(404).json({ message: "No category with this ID found" });
        }

     
        await category.remove();
        return res.status(200).json({ message: "Category deleted successfully" });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting the category",
            error: error.message, // Provide more details about the error if needed
        });
    }
};

module.exports = {
    createCategory,
    getAllCategory,
    getAllCategorybyAdmin,
    updateCatagory,
    deleteCategory
    
}
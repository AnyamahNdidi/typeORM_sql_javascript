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
 *         parent: fruits
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

    // Associate the category with the user (admin)
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

module.exports = {
    createCategory
}
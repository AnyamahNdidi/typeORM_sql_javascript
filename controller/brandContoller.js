const product = require("../Model/productModel")
const { getRepository } = require('typeorm');
const categories = require("../Model/categoryModel")
const Admins = require("../Model/AdminRegModel")
const brands = require("../Model/brandModel")
const brandImages = require("../Model/brandImagModel")



/**
 * @swagger
 * components:
 *   schemas:
 *     brand:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: name of brand
 *         description:
 *           type: string
 *           description: brief description of brand
 *         catergory:
 *           type: string
 *           description: category it can be found
 *         images:
 *           type: string
 *           format: binary
 *           description: the imag file
 *       example:
 *         name: "nike"
 *         description: "when it comes to footware we provide the best"
 *         catergory: "footwears"
 *         images: "file.jpeg"
 */






/**
 * @swagger
 *  /api/v1/create-brand/{adminId}:
 *  post:
 *    summary: end point for brand creating
 *    tags: [Create brand]
 *    parameters:
 *      - in: path
 *        name: adminId
 *        schema:
 *          type: string
 *          format: varchar
 *        required: true
 *        description: This is the user id(admin) 
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/brand'
 *    responses:
 *      200:
 *        description: The brand has been created
 *      404:
 *        description: The error in creating brand
 *      500:
 *        description: Some error happened
 */



exports.createBrand = async (req, res) => {
    try
    {
        const { name, description, catergory } = req.body
        if (!name || !description || !catergory)
        {
            return res.status(400).json({message:"please enter all field"})
        }

        const findCat = await categories.findOne({ where :{name: catergory}})
       
        if (!findCat)
        {
             return res.status(400).json({message:"brand not existing"})
        }
        const { adminId } = req.params; 
        const admin = await Admins.findOne({ where: { id: adminId } });
        console.log(admin)
        console.log(req.files)

          let brandPictures = [];
       
           const brandCreate = await brands.create({
            name,
            description,
            catergory,
            category_id: findCat.id,
            userid: admin.id,
           }).save();
    
           console.log("jksdbcjklhd",brandCreate.id)
        
            for (const file of req.files.images) {
                console.log("Uploading file", file);
                const imageBrand = new brandImages();
                imageBrand.filename = file.filename;
                
                imageBrand.brand_id = brandCreate.id; 
                
                const savedImage = await imageBrand.save();

                brandCreate.image.push(savedImage);
                brandPictures.push(savedImage);
            }
         res.status(201).json({ message: 'brand created successfully',  data: brandCreate});     

        
    } catch (error)
    {
          return res.status(500).json({
            message: "An error occurred trying to create brand",
            error: error.message, 
        });
    }
}

 


/**
 * @swagger
 * components:
 *   schemas:
 *     brandupdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: name of brand
 *         description:
 *           type: string
 *           description: brief description of brand
 *         catergory:
 *           type: string
 *           description: category it can be found
 *         images:
 *           type: string
 *           format: binary
 *           description: the imag file
 *       example:
 *         name: "nike"
 *         description: "when it comes to footware we provide the best"
 *         catergory: "footwears"
 *         images: "file.jpeg"
 */






/**
 * @swagger
 *  /api/v1/update-brand/{brandId}:
 *  put:
 *    summary: end point for brand updating
 *    tags: [Create brand]
 *    parameters:
 *      - in: path
 *        name: brandId
 *        schema:
 *          type: string
 *          format: varchar
 *        required: true
 *        description: This is the brand id
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/brandupdate'
 *    responses:
 *      200:
 *        description: The brand has been created
 *      404:
 *        description: The error in creating brand
 *      500:
 *        description: Some error happened
 */

exports.updateBrand = async (req, res) => {
    try
    {
        const { name, description, catergory } = req.body
         const { brandId } = req.params;
        const brand = await brands.findOne({
            where: { id: brandId }
        });

        if (!brand)
        {
            return res.status(404).json({ message: "No brand with this id" });
        }

        const findCat = await categories.findOne({ where :{name: catergory}})
       
        if (!findCat)
        {
             return res.status(400).json({message:"category not existing"})
        }


        brand.name = name || brand.name;
        brand.description = description || brand.description;
        brand.catergory = catergory || brand.catergory
        brand.category_id = findCat.id || brand.category_id 
        

        if (req.files && req.files.images)
        {
     await brandImages.delete({ brand_id: brand.id });
      const brandImagess = [];

      for (const file of req.files.images) {
        console.log("Uploading file", file);
        const imageBrand = new brandImages();
        imageBrand.filename = file.filename;
        imageBrand.brand_id = brand.id;

        const savedImage = await imageBrand.save();

        brandImagess.push(savedImage);
      }
    }

        // Save the updated brand
         brand.image = await brandImages.find({
        where: { brand_id: brand.id },
      });
    
  
        await brand.save()
        return res.status(201).json({ message: 'brand update sucessfully successfully',  data: brand});   
        
    } catch (error)
    {
          return res.status(500).json({
            message: "An error occurred trying to update brand",
            error: error.message, 
        });
    }
}




/**
 * @swagger
 * /api/v1/all-brand:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for retrieving all brand
 *     tags: [Create brand]
 *     responses:
 *       200:
 *         description: list of all brand
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

exports.getAllBrand = async (req, res) => {
    try
    {
        const bradDataall = []
        const allBrand= await brands.find()
        // const getImages = await productImages.find({ where: { product_id: "d34425f4-aa0d-4a08-8f6d-231586c869ce" } });
        // console.log(getImages)


        for (const braData of allBrand)
        {
               
            const getImages = await brandImages.find({ where: { brand_id: braData.id } });
             const filteredProdImages = getImages.map((value) => {
                const filteredProd = {
                    img: value.filename,
                  
                };

                return filteredProd;
            });
            const getProd = await product.find({ where: { brand_id: braData.id }, select: ["productTitle", "fullDesc", "category", "regularPrice", "promotionalPrice"], })
              const filteredprod = getProd.map((value) => {
                const filteredpro= {
                    productTitle: value.productTitle,
                    fullDesc: value.fullDesc,
                    category: value.category,
                    regularPrice: value.regularPrice,
                    promotionalPrice:value.promotionalPrice
                    
                    

                };

               
                Object.keys(filteredpro).forEach((key) => {
                    if (filteredpro[key] === undefined || filteredpro[key] === '') {
                        delete filteredpro[key];
                    }
                });

                return filteredpro;
            });
            
            
          
            const brandObj = {
                id: braData.id,
                name: braData.name,
                description: braData.description,
                catergory: braData.catergory,
                image: braData.image,
                product: braData.product
                
            };
            brandObj.image = filteredProdImages
            brandObj.product = filteredprod
           

            bradDataall.push(brandObj);
        }
         
         return res.status(200).json({
            message: "all brand",
            data: bradDataall,
        })

    } catch (error)
    {
          return res.status(500).json({
            message: "An error occurred getting all brand",
            error: error.message, 
        });
    }
        
}


/**
 * @swagger
 * /api/v1/brand-by-admin/{adminId}:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for retrieving all brand posted by a specific admin
 *     tags: [Create brand]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: The properties id
 *     responses:
 *       200:
 *         description: The list of the brand
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

exports.getAllBrandByAdmin = async (req, res) => {
    
    try
    {
          const dataOne = []
         const brandP= await brands.find()
         for (const adminData of brandP)
         {
           const getImages = await brandImages.find({ where: { brand_id: adminData.id } });
             const filteredProdImages = getImages.map((value) => {
                const filteredProd = {
                    img: value.filename,
                  
                };

                return filteredProd;
            });
            const getProd = await product.find({ where: { brand_id: adminData.id }, select: ["productTitle", "fullDesc", "category", "regularPrice", "promotionalPrice"], })
              const filteredprod = getProd.map((value) => {
                const filteredpro= {
                    productTitle: value.productTitle,
                    fullDesc: value.fullDesc,
                    category: value.category,
                    regularPrice: value.regularPrice,
                    promotionalPrice:value.promotionalPrice
                    
                    

                };

               
                Object.keys(filteredpro).forEach((key) => {
                    if (filteredpro[key] === undefined || filteredpro[key] === '') {
                        delete filteredpro[key];
                    }
                });

                return filteredpro;
            });
            
             if (adminData.userid === req.params.adminId)
             {
                const onjData = {
                    id: adminData.id,
                    name: adminData.name,
                    description:adminData.description,
                    catergory: adminData.catergory,
                    image: adminData.image,
                    product: adminData.product,
    
                    
                 }
                 
                 //  onjData.productImages = filteredProds
                   onjData.image = filteredProdImages
                    onjData.product = filteredprod
           
                dataOne.push(onjData)
             }
            
         }
         
         if (dataOne.length === 0)
         {
             return res.status(404).json({
                 message:"this admin has no brand posted or wrong id"
            }) 
         }          
         return  res.status(200).json({
            message: "category by admin",
            data: dataOne,
        })

    } catch (error)
    {
        return res.status(500).json({
            message: "An error occurred trying to get bramd by admin",
            error: error.message, 
        });
    }

        
}


/**
 * @swagger
 * /api/v1/single-brand/{brandId}:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for retrieving single brand by id
 *     tags: [Create brand]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         schema:
 *           type: string
 *         required: true
 *         description: The properties id
 *     responses:
 *       200:
 *         description: The list of the brand
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

exports.getBrandById = async (req, res) => {
    try {
        const { brandId } = req.params;

        // Find the brand by its ID
        const brand = await brands.findOne({
            where: { id: brandId },
        });

        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

      
        const getImages = await brandImages.find({ where: { brand_id: brand.id } });
        const filteredImages = getImages.map((value) => {
            return {
                img: value.filename,
            };
        });

        const getProducts = await product.find({
            where: { brand_id: brand.id },
            select: ["productTitle", "fullDesc", "category", "regularPrice", "promotionalPrice"],
        });

        const filteredProducts = getProducts.map((value) => {
            const filteredProduct = {
                productTitle: value.productTitle,
                fullDesc: value.fullDesc,
                category: value.category,
                regularPrice: value.regularPrice,
                promotionalPrice: value.promotionalPrice,
            };

            Object.keys(filteredProduct).forEach((key) => {
                if (filteredProduct[key] === undefined || filteredProduct[key] === '') {
                    delete filteredProduct[key];
                }
            });

            return filteredProduct;
        });

        const brandData = {
            id: brand.id,
            name: brand.name,
            description: brand.description,
            catergory: brand.catergory,
            image: filteredImages,
            product: filteredProducts,
        };

        return res.status(200).json({
            message: "Brand details",
            data: brandData,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching the brand",
            error: error.message,
        });
    }
};



/**
 * @swagger
 * /api/v1/delete-brand/{brandId}:
 *   delete:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for deleting a single
 *     tags: [Create brand]
 *     parameters:
 *       - in: path
 *         name: brandId
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



exports.deleteBrand = async (req, res) => {
    try
    {
         const { brandId } = req.params;

        const brand = await brands.findOne({ where: { id: brandId } });

        if (!brand) {
            return res.status(404).json({ message: "No brand with this ID found" });
        }

     
        await brand.remove();
        return res.status(200).json({ message: "brand deleted successfully" })
    } catch (error)
    {
         return res.status(500).json({
            message: "An error occurred trying to delete brand",
            error: error.message, 
        });
    }
}

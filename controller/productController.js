const product = require("../Model/productModel")
const { getRepository } = require('typeorm');
const categories = require("../Model/categoryModel")
const Admins = require("../Model/AdminRegModel")
const products = require("../Model/productModel")
const productImages = require("../Model/product_images")
const brands = require("../Model/brandModel")


/**
 * @swagger
 * components:
 *   schemas:
 *     product:
 *       type: object
 *       properties:
 *         productTitle:
 *           type: string
 *           description: name of brand
 *         fullDesc:
 *           type: string
 *           description: brief description of brand
 *         regularPrice:
 *           type: number
 *           description: this for regular price
 *         promotionalPrice:
 *           type: number
 *           description: promotional price
 *         currency:
 *           type: string
 *           description: category it can be found
 *         category:
 *           type: string
 *           description: category it can be found
 *         brand:
 *           type: string
 *           description: category it can be found
 *         images:
 *           type: string
 *           format: binary
 *           description: the imag file
 *       example:
 *         productTitle: "t-shirt"
 *         fullDesc: "xl, x, xxl"
 *         regularPrice: 3000
 *         promotionalPrice: 2500
 *         currency: "NGN"
 *         category: "men's shirt"
 *         brand: "Nike"
 *         images: "file.jpeg"
 */






/**
 * @swagger
 *  /api/v1/create-product/{adminId}:
 *  post:
 *    summary: end point for creating product
 *    tags: [product]
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
 *            $ref: '#/components/schemas/product'
 *    responses:
 *      200:
 *        description: The brand has been created
 *      404:
 *        description: The error in creating brand
 *      500:
 *        description: Some error happened
 */

exports.createProd = async (req, res) => {
    try
    {
        const {
            productTitle,
            fullDesc,
            regularPrice,
            promotionalPrice,
            currency,
            category,
            brand
        } = req.body
        if (!productTitle || !fullDesc || !regularPrice || !promotionalPrice || !currency || !category)
        {
            return res.status(400).json({message:"please enter all field"})
        }

        const findCat = await categories.findOne({ where :{name: category}})
       
        if (!findCat)
        {
             return res.status(400).json({message:"category not existing"})
        }
        console.log(findCat)

        const findBrad = await brands.findOne({ where: { name: brand } })
        
        if (!findBrad)
        {
             return res.status(400).json({message:"brand not existing"})
        }
        console.log(findBrad)


        const { adminId } = req.params; 
        const admin = await Admins.findOne({ where: { id: adminId } });
        console.log(admin)
        // console.log(req.files)

          let prodPictures = [];
       
           const prouctCreate = await products.create({
            productTitle,
            fullDesc,
            regularPrice,
            promotionalPrice,
            currency,
            category,
            brand,
            category_idd: findCat.id,
            brand_id: findBrad.id,
            user_id: admin.id,
           }).save();
    
           console.log("jksdbcjklhd",prouctCreate.id)
        
            for (const file of req.files.images) {
                console.log("Uploading file", file);
                const imageProd = new productImages();
                imageProd.filename = file.filename;
                
                imageProd.product_id = prouctCreate.id; 
                
                const savedImage = await imageProd.save();

                prouctCreate.productImages.push(savedImage);
                prodPictures.push(savedImage);
        }
        
        return res.status(201).json({
            message: 'brand created successfully',
            data: prouctCreate
        });     

        
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
 *     productupdate:
 *       type: object
 *       properties:
 *         productTitle:
 *           type: string
 *           description: name of brand
 *         fullDesc:
 *           type: string
 *           description: brief description of brand
 *         regularPrice:
 *           type: number
 *           description: this for regular price
 *         promotionalPrice:
 *           type: number
 *           description: promotional price
 *         currency:
 *           type: string
 *           description: category it can be found
 *         category:
 *           type: string
 *           description: category it can be found
 *         brand:
 *           type: string
 *           description: category it can be found
 *         images:
 *           type: string
 *           format: binary
 *           description: the imag file
 */






/**
 * @swagger
 *  /api/v1/update-product/{productId}:
 *  put:
 *    summary: end point for creating product
 *    tags: [product]
 *    parameters:
 *      - in: path
 *        name: productId
 *        schema:
 *          type: string
 *          format: varchar
 *        required: true
 *        description: This is the product identifier 
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/productupdate'
 *    responses:
 *      200:
 *        description: The brand has been created
 *      404:
 *        description: The error in creating brand
 *      500:
 *        description: Some error happened
 */

exports.updateProd = async (req, res) => {
    try
    {
       const {
            productTitle,
            fullDesc,
            regularPrice,
            promotionalPrice,
            currency,
            category,
            brand
        } = req.body

         const { productId } = req.params;
        const product = await products.findOne({
            where: { id: productId }
        });

        
       

        const findCat = await categories.findOne({ where :{name: category}})
       
        if (!findCat)
        {
             return res.status(400).json({message:"category not existing"})
        }
        console.log(findCat)

        const findBrad = await brands.findOne({ where: { name: brand } })
        
        if (!findBrad)
        {
             return res.status(400).json({message:"brand not existing"})
        }

        console.log(findBrad)
        if (!product)
        {
            return res.status(404).json({ message: "No product with this id" });
        }

        


        product.productTitle = productTitle || product.productTitle;
        product.fullDesc = fullDesc || product.fullDesc;
        product.regularPrice = regularPrice || product.regularPrice
        product.promotionalPrice = promotionalPrice || product.promotionalPrice
        product.currency = currency || product.currency
        product.category = category || product.category
        product.brand = brand || product.brand
        product.category_idd = findCat.id || product.category_idd
        product.brand_id = findBrad.id || product.brand_id
        

    if (req.files && req.files.images)
        {
     await productImages.delete({ product_id : product.id });
      const brandImagess = [];

      for (const file of req.files.images) {
        console.log("Uploading file", file);
        const imageProd = new productImages();
        imageProd.filename = file.filename;
        imageProd.product_id = product.id;

        const savedImage = await imageProd.save();

        brandImagess.push(savedImage);
      }
    }

        
     product.productImages = await productImages.find({
        where: { product_id: product.id },
      });
    
  
        await product.save()
        return res.status(201).json({ message: 'product update sucessfully ',  data: product});   
        
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
 * /api/v1/all-product:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for retrieving all product
 *     tags: [product]
 *     responses:
 *       200:
 *         description: list of all brand
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
exports.getAllProduct = async (req, res) => {
    try
    {
        const prodDataall = []
        const allProduct = await products.find()
       
        // console.log(getImages)


        for (const proData of allProduct)
        {
             const getBrand = await brands.find({ where: { category_id: proData.id }  })
               
            const getImages = await productImages.find({ where: { product_id: proData.id } });
            
             const filteredProds = getImages.map((value) => {
                const filteredProd = {
                    img: value.filename,
                  
                };

                return filteredProd;
            });
          

            const prodObj = {
                id: proData.id,
                productTitle: proData.productTitle,
                fullDesc: proData.fullDesc,
                regularPrice: proData.regularPrice,
                promotionalPrice: proData.promotionalPrice,
                currency: proData.currency,
                category: proData.category,
                brand: proData.brand,
                productImages: proData.productImages
                
            };
            prodObj.productImages = filteredProds
           
       

            prodDataall.push(prodObj);
        }
         
         return res.status(200).json({
            message: "all product",
            data: prodDataall,
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
 * /api/v1/single-product/{productId}:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for retrieving single brand by id
 *     tags: [product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The properties id
 *     responses:
 *       200:
 *         description: The list of the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

      
        const product = await products.findOne({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        
        const getImages = await productImages.find({ where: { product_id: product.id } });
        const filteredImages = getImages.map((value) => {
            return {
                img: value.filename,
            };
        });

        const brand = await brands.findOne({ where: { id: product.brand_id } });

        const productData = {
            id: product.id,
            productTitle: product.productTitle,
            fullDesc: product.fullDesc,
            regularPrice: product.regularPrice,
            promotionalPrice: product.promotionalPrice,
            currency: product.currency,
            category: product.category,
            brand: brand ? brand.name : null, // Get brand name or handle cases where brand is not found
            productImages: filteredImages,
        };

        return res.status(200).json({
            message: "Product details",
            data: productData,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching the product",
            error: error.message,
        });
    }
};


/**
 * @swagger
 * /api/v1/product-by-admin/{adminId}:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for retrieving all product posted by a specific admin
 *     tags: [product]
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


exports.getAllOroductByAdmin = async (req, res) => {
    
    try
    {
          const dataOne = []
         const adminProduct = await products.find()
         for (const adminData of adminProduct)
         {
              const getImages = await productImages.find({ where: { product_id: adminData.id } });
            
             const filteredProds = getImages.map((value) => {
                const filteredProd = {
                    img: value.filename,
                  
                };

                return filteredProd;
            });
             if (adminData.user_id === req.params.adminId)
             {
                const onjData = {
                    id: adminData.id,
                    productTitle: adminData.productTitle,
                    fullDesc:adminData.fullDesc,
                    regularPrice: adminData.regularPrice,
                    promotionalPrice: adminData.promotionalPrice,
                    currency: adminData.currency,
                    category: adminData.category,
                    brand: adminData.brand,
                    productImages: adminData.productImages,
                    // brands: filteredBrands
                    
                 }
                 
                 onjData.productImages = filteredProds
                dataOne.push(onjData)
             }
            
         }
         
         if (dataOne.length === 0)
         {
             return res.status(404).json({
                 message:"this admin has no prodcut posted or wrong id"
            }) 
         }          
         return  res.status(200).json({
            message: "category by admin",
            data: dataOne,
        })

    } catch (error)
    {
        return res.status(500).json({
            message: "An error occurred trying to get get brand by admin",
            error: error.message, 
        });
    }

        
}


/**
 * @swagger
 * /api/v1/delete-product/{productId}:
 *   delete:
 *     security:
 *       - Authorization: []
 *     summary: endpoint for deleting a product
 *     tags: [product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: delete a single product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */


exports.deleteProduct = async (req, res) => {
    try
    {
         const { productId } = req.params;

        const product = await products.findOne({ where: { id: productId } });

        if (!product) {
            return res.status(404).json({ message: "No product with this ID found" });
        }

     
        await product.remove();
        return res.status(200).json({ message: "product deleted successfully" })
    } catch (error)
    {
         return res.status(500).json({
            message: "An error occurred trying to delete brand",
            error: error.message, 
        });
    }
}
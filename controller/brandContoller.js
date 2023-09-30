const product = require("../Model/productModel")
const { getRepository } = require('typeorm');
const categories = require("../Model/categoryModel")
const Admins = require("../Model/AdminRegModel")
const brands = require("../Model/brandModel")
const brandImages = require("../Model/brandImagModel")




exports.createBrand = async (req, res) => {
    try
    {
        const { name, description, catergory } = req.body
        if (!name || !description || !catergory)
        {
            return res.status(400).json({message:"please enter all field"})
        }

        const findCat = await categories.findOne({ where :{name: catergory}})
        console.log("cat",findCat.id)
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
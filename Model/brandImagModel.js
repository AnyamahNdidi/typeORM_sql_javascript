const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany, ManyToMany, ManyToOne } = require("typeorm");
const products = require("./productModel")
const Admins = require("./AdminRegModel.js");
const categories = require("./categoryModel")
const brands = require("./brandModel")



class brand_images extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.brand_id = brands;
        this.filename = "";
      
    }

}

Entity("brand_images")(brand_images);
PrimaryGeneratedColumn("uuid")(brand_images.prototype, "id");
Column("varchar")(brand_images.prototype, "filename"); 
Column("varchar")(brand_images.prototype, "brand_id"); 



 
ManyToOne(() => brands, (brand) => brand.image)
JoinColumn()
brand_images.prototype.brand_id = null;



module.exports = brand_images
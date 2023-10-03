const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany, ManyToMany, ManyToOne } = require("typeorm");
const products = require("./productModel")
const Admins = require("./AdminRegModel.js");
const categories = require("./categoryModel")
const brands = require("./brandModel")




class product_images extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.product_id = brands;
        this.filename = "";
      
    }

}

Entity("product_images")(product_images);
PrimaryGeneratedColumn("uuid")(product_images.prototype, "id");
Column("varchar")(product_images.prototype, "filename"); 
Column("varchar")(product_images.prototype, "product_id"); 



 
ManyToOne(() => products, (product) => product.productImages)
JoinColumn()
product_images.prototype.product_id = null;



module.exports = product_images
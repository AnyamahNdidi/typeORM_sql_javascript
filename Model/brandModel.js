const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany, ManyToMany, ManyToOne } = require("typeorm");
const products = require("./productModel")
const Admins = require("./AdminRegModel.js");
const categories = require("./categoryModel")
const brandImages  = require('./brandImagModel')



class brands extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.name = "";
        this.description = "";
        this.image = [];
        this.category_id = categories ;
        this.catergory = "";
        this.userid = ""
        this.product = [];
    }

}

Entity("brands")(brands);
PrimaryGeneratedColumn("uuid")(brands.prototype, "id");
Column("varchar")(brands.prototype, "name"); 
Column("nvarchar")(brands.prototype, "description");
Column("nvarchar")(brands.prototype, "userid");
Column("nvarchar")(brands.prototype, "catergory");
Column("nvarchar")(brands.prototype, "category_id");


 
ManyToOne(() => categories, (category) => category.brands)
JoinColumn()
brands.prototype.category_id = categories;

OneToMany(() => brandImages, (brand) => brand.brand_id)
JoinColumn()
brands.prototype.image = brandImages;



module.exports = brands
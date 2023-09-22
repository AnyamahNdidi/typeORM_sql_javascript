const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany, ManyToMany, ManyToOne } = require("typeorm");
const products = require("./productModel")
const Admins = require("./AdminRegModel.js");
const categories = require("./categoryModel")



class brands extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.name = "";
        this.description = "";
        this.logo = "";
        this.category_id = categories ;
        this.website = ""
        this.product = [];
    }

}

Entity("brands")(brands);
PrimaryGeneratedColumn("uuid")(brands.prototype, "id");
Column("varchar")(brands.prototype, "name"); 
Column("nvarchar")(brands.prototype, "description");
Column("nvarchar")(brands.prototype, "logo");
Column("nvarchar")(brands.prototype, "category_id");


 
ManyToOne(() => categories, (category) => category.brands)
JoinColumn()
brands.prototype.categories = categories;



module.exports = brands
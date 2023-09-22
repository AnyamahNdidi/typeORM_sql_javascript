const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany } = require("typeorm");
const products = require("./productModel.js")
const Admins = require("./AdminRegModel.js");
const brands = require("./brandModel.js");



class categories extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.name = "";
        this.slug = "";
        this.parent = "";
        this.user = Admins;
        this.order = 0;
        this.product = [];
        this.brands = [];
        this.description = ""; 
    }

   
}

Entity("categories")(categories);
PrimaryGeneratedColumn("uuid")(categories.prototype, "id");
Column("varchar")(categories.prototype, "name"); 
Column("nvarchar")(categories.prototype, "slug");
Column("nvarchar")(categories.prototype, "parent");
Column("nvarchar")(categories.prototype, "order");
Column("nvarchar")(categories.prototype, "user");
Column("nvarchar")(categories.prototype, "description");

OneToOne(() => Admins)
JoinColumn()

OneToMany(() => products, (product) => product.category_idd)
JoinColumn()
categories.prototype.product = [];

OneToMany(() => brands, (brand) => brand.category_id)
JoinColumn()
categories.prototype.brand = [];

module.exports = categories;


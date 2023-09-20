const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany } = require("typeorm");
const products = require("./productModel")
const Admins = require("./AdminRegModel.js");



class categories extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.name = "";
        this.slug = "";
        this.parent = "";
        this.user = Admins;
        this.userDeatiails = null
        this.order = 0;
        this.product=[];
        // this.brand=[];
        this.description = ""; // Reference to Profile entity
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

OneToMany(() => products, (product) => product.category)
JoinColumn()
categories.prototype.product = [];

module.exports = categories;


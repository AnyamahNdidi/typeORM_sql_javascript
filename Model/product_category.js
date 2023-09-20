const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany } = require("typeorm");
const products = require("./productModel")
const categories = require("./categoryModel")


class category_product_relation extends BaseEntity {
    constructor() {
        super();
        this.id = id;
        this.categoryId = categoryId;
        this.productId = productId; // Reference to Profile entity
    }

   
}

Entity("category_product_relation")(category_product_relation);
PrimaryGeneratedColumn("uuid")(categories.prototype, "id");


OneToMany(() => products, (product) => product.category)
JoinColumn()
categories.prototype.product = [];

module.exports = category_product_relation;


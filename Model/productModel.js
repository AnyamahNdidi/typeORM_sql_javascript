const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn,ManyToOne } = require("typeorm");
const categories = require("./categoryModel")
const brands = require("./brandModel")

class products extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.productTitle = "";
        this.fullDesc = "";
        this.regularPrice =0;
        this.promotionalPrice=0;
        this.currency="";
        this.taxRate = 0; 
        this.category_idd = categories;
        this.brands_id = brands
    }

   
}

Entity("products")(products);
PrimaryGeneratedColumn("uuid")(products.prototype, "id");
Column("varchar")(products.prototype, "productTitle"); 
Column("nvarchar")(products.prototype, "fullDesc");
Column("nvarchar")(products.prototype, "regularPrice");
Column("nvarchar")(products.prototype, "promotionalPrice");
Column("nvarchar")(products.prototype, "currency");
Column("nvarchar")(products.prototype, "taxRate");
 
ManyToOne(() => categories, (category) => category.product)
JoinColumn()
products.prototype.category_idd = categories;

module.exports = products;

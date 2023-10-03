const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn,ManyToOne,OneToMany } = require("typeorm");
const categories = require("./categoryModel")
const brands = require("./brandModel")
const productImages = require("./product_images")

class products extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.productTitle = "";
        this.fullDesc = "";
        this.regularPrice =0;
        this.promotionalPrice=0;
        this.currency="";
        this.category="";
        this.brand="";
        this.productImages = []; 
         this.user_id = ""
        this.category_idd = categories;
        this.brand_id = brands
    }

   
}

Entity("products")(products);
PrimaryGeneratedColumn("uuid")(products.prototype, "id");
Column("varchar")(products.prototype, "productTitle"); 
Column("nvarchar")(products.prototype, "fullDesc");
Column("nvarchar")(products.prototype, "regularPrice");
Column("nvarchar")(products.prototype, "promotionalPrice");
Column("nvarchar")(products.prototype, "currency");
Column("nvarchar")(products.prototype, "category");
Column("nvarchar")(products.prototype, "brand");
Column("nvarchar")(products.prototype, "category_idd");
Column("nvarchar")(products.prototype, "brand_id");
Column("nvarchar")(products.prototype, "user_id");

 
ManyToOne(() => categories, (category) => category.product)
JoinColumn()
products.prototype.category_idd = categories;

OneToMany(() => productImages, (brand) => brand.brand_id)
JoinColumn()
products.prototype.productImages = productImages;


module.exports = products;

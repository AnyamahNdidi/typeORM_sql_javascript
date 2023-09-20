const { Entity, Column, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } = require("typeorm");
const bcrypt = require('bcrypt');
const profiles = require("./profileModel");

class Admins extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.fullname = "";
        this.email = "";
        this.password ="";
        this.verified="";
        this.isActive=""; // Reference to Profile entity
    }

    hashPassword() {
        const saltRounds = 10;
        return bcrypt.genSalt(saltRounds)
            .then((salt) => bcrypt.hash(this.password, salt))
            .then((hash) => {
                this.password = hash;
            });
    }


    async checkPassword(plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    }
}

Entity("admins")(Admins);
PrimaryGeneratedColumn("uuid")(Admins.prototype, "id");
Column("varchar")(Admins.prototype, "fullname"); 
Column("nvarchar")(Admins.prototype, "email");
Column("nvarchar")(Admins.prototype, "password");
BeforeInsert()(Admins.prototype, "hashPassword");

// Column("varchar",{ nullable: true })(Admins.prototype, "token");
Column("tinyint")(Admins.prototype, "verified");
Column("tinyint")(Admins.prototype, "isActive");



module.exports = Admins;

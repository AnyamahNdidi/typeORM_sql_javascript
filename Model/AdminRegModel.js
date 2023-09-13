const { Entity, Column, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } = require("typeorm");
const bcrypt = require('bcrypt');
const Profiles = require("./profileModel");

class Admins extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.fullname = "";
        this.email = "";
        this.password = "";
        this.verified = false;
        this.profile = null; // Reference to Profile entity
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
Column("varchar")(Admins.prototype, "fullname"); // Specify column type as "varchar"
Column("nvarchar")(Admins.prototype, "email");
Column("nvarchar")(Admins.prototype, "password");
BeforeInsert()(Admins.prototype, "hashPassword");
BeforeUpdate()(Admins.prototype, "hashPassword");
// Column("varchar",{ nullable: true })(Admins.prototype, "token");
Column("tinyint", { default: 0 })(Admins.prototype, "verified");

// Define the bidirectional relationship with Profile entity
OneToOne(() => Profiles, (profile) => profile.user)(Admins.prototype, "profiles");

module.exports = Admins;

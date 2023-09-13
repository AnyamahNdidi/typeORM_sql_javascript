const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } = require("typeorm");
const Admins = require("./AdminRegModel");

class Profiles extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.firstName = "";
        this.lastName = "";
        this.gender = null;
        this.avatar = "https://res.cloudinary.com/ndtech/image/upload/v1683028487/24-248253_user-profile-default-image-png-clipart-png-download_b7feyx.png";
        this.user = null; // Reference to User entity
    }
}

Entity("profiles")(Profiles);
PrimaryGeneratedColumn("uuid")(Profiles.prototype, "id");
Column("varchar",{ default: "" })(Profiles.prototype, "firstName");
Column("varchar",{ default: "" })(Profiles.prototype, "lastName");
Column("varchar",{ nullable: true })(Profiles.prototype, "gender");
Column("varchar",{ default: "https://res.cloudinary.com/ndtech/image/upload/v1683028487/24-248253_user-profile-default-image-png-clipart-png-download_b7feyx.png" })(Profiles.prototype, "avatar");


// OneToOne(() => Admins, (admins) => admins.profile)(Profiles.prototype, "admins");

module.exports = Profiles;

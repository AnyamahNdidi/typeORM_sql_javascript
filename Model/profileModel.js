const { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } = require("typeorm");
const Admins = require("./AdminRegModel.js");

class profiles extends BaseEntity {
    constructor() {
        super();
        this.id = undefined;
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.phoneNum = "";
        this.DateOfBirth = "";
        this.address = "";
        this.avatar = "";
        this.adminId= null // Reference to User entity
    }
}

Entity("profiles")(profiles);
PrimaryGeneratedColumn("uuid")(profiles.prototype, "id");
Column("nvarchar",{ default: "" })(profiles.prototype, "firstName");
Column("nvarchar",{ default: "" })(profiles.prototype, "lastName");
Column("nvarchar", { default: "" })(profiles.prototype, "email");
Column("nvarchar",{ default: "" })(profiles.prototype, "address");
Column("nvarchar",{ default: "" })(profiles.prototype, "DateOfBirth");
Column("nvarchar",{ default: ""})(profiles.prototype, "phoneNum");
Column("nvarchar",{ default: ""})(profiles.prototype, "avatar");
Column("nvarchar",{ default: ""})(profiles.prototype, "adminId");


OneToOne(() => Admins, (admin) => admin.profile)
JoinColumn()
profiles.prototype.admin = null;



module.exports = profiles;

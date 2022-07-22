const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: [isEmail, "Please enter a valid email"],
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password is too short"]
    },
    tracking_list: [{
        product_id: { type: Schema.Types.ObjectId, ref: 'Product' }, 
        threshold_price: Number 
    }]
}, { timestamps: true });



userSchema.pre("save", async function (next) {
    let salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})



userSchema.statics.login = async function (email, password) {
    let user = await User.findOne({ email });
    if (user) {
        let is_matched = await bcrypt.compare(password, user.password);
        if (is_matched) {
            return user;
        }
        else {
            throw new Error("passwordError");
        }
    }
    else {
        throw new Error("emailError");
    }
}



const User = mongoose.model("user", userSchema);

module.exports = User;
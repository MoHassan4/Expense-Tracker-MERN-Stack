const mongoose = require("mongoose");
const hashPassword = require("../utils/hashPassword");
const bcrypt = require("bcryptjs");


const userSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
  },
  { timestamps: true },
);

// Hash Password befor saving 

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


// Hashing Password
userSchema.methods.comparePassword =  async function (candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}

module.exports = mongoose.model("User",userSchema);
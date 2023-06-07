const mongoose = require('mongoose');

//create schema for the table
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

//create model
const UsersModel = mongoose.model("users", UserSchema);

module.exports = UsersModel;
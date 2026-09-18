const mongoose = require('mongoose');
const userModel = require('./models/User');
module.exports = {connectDB, createUser, loadUserData};
async function connectDB(){
    try{
        await mongoose.connect("mongodb+srv://whodark:QnbLY0LEvcPa2LA3@cluster0.a3l6vlt.mongodb.net/?appName=Cluster0")
        console.log("Connected to MongoDB.")
    }catch(e){
        console.log(e)//
    }
}
async function loadUserData(userID, token){
    let user = await userModel.findOne({username: userID, password: token})
    if(!user) return {success: false, message: "User not found."}
    return {success: true, user}
}
async function createUser(username, password){
    let existingUser = await userModel.findOne({username})
    if(existingUser) return {success: false, message: "User already exists."}
    let newUser = new userModel({username, password})
    await newUser.save()
    return {success: true, user: newUser}
}
import mongoose from "mongoose"


//set rule/schema
const userSchema = new  mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim:true,
        maxLength: 255
    },
    email: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
        Unique: true //index => same email cannot be repeated in user table

    },
    password:{
        type: String,
        required: true,
        trim: true,
    },   
    gender:{
        type: String,
        required: true,
        trim: true,
        enum: ['male', 'Female', 'Prefer not to say']
    },
    phoneNumber:{
        type: String,
        required: true,
        maxLength: 20,
        minLength: 10
    },
    address: {
        type: String,
        required: false,
        trim: true,
        maxLength: 255
    }
});

//create table/model/collection
const User = mongoose.model("User", userSchema);

export default User;


//user table
//_id
//fullName
//email
// password
// gender
// phoneNumber
//address
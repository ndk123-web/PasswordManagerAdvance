import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/PasswordManager")
.then( () => {
    console.log("Connected to MongoDB");
} )
.catch( (err) => {
    console.error("Error connecting to MongoDB", err);
})

const passwordSchema = new mongoose.Schema({
    website : String,
    username : String,
    password : String
})

export const Password = mongoose.model("allpasswords" , passwordSchema);
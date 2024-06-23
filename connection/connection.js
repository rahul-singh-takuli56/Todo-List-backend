const mongoose = require("mongoose");

const connection = async (req, res) => {
    try {
        await mongoose.connect("mongodb+srv://rahulsinghkb56:wvSRKIfr4pB7U1If@cluster0.thmxy2f.mongodb.net/").then(() => {
            console.log("Mongo DB Connected Succesfully");
        })
    } catch (error) {
        res.status(400).json({ message: "not Connected" });
    }
}

connection();
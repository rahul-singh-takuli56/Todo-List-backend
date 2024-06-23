const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Register
router.post("/register", async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const user = new User({ email, password: hashedPassword, username });
        await user.save().then(() => res.status(200).json({ message: "Sign Up Successful" }));

    } catch (error) {
        res.status(200).json({ message: "User Already Exists" });
    }
});



// Sign In
router.post("/signin", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(200).json({ message: "Please Sign Up First" });
        }

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

        if (!isPasswordCorrect) {
            return res.status(200).json({ message: "Password is not correct" });
        }

        const { password, ...others } = user._doc;
        res.status(200).json(others);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

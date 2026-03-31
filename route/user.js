import express from "express";
const router = express.Router();
import User from "../model/user.js";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import app from "./chat.js";


router.post("/thread/signUp", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "user already exist" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashedpassword", hashedPassword);


        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })


        const reigisterdUser = await newUser.save();
        res.status(201).json({ message: "user registrede successfully" });

    } catch (err) {
        res.status(500).json({ message: `something went wrong ${err}` });
    }
})

router.post("/thread/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user doesn't exist" });
        }
        // console.log("user is", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "invalid credentials" });
        }
        let token = crypto.randomBytes(32).toString("hex");
        user.token = token;


        await user.save();

        return res.status(200).json({ message: "user logged in", token });

    } catch (err) {
        res.status(500).json({ message: `something went wrong ${err}` });
    }
})


router.delete("/logout", async (req, res) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const token = authHeader.split(" ")[1];
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found " });
        }
        user.token = null;
        await user.save();
        res.status(200).json({ message: "user logout" });

    } catch (err) {
        res.status(500).json({ message: `something went wrong ${err}` });
    }
})

//just for testing
router.delete("/deleteAll", async (req, res) => {
    try {
        const deleteUser = await User.deleteMany({});
        res.status(200).json({ message: "all user deleted ", deleteUser });

    } catch (err) {
        res.status(400).json({ message: `something went wrong ${err}` });
    }

})

router.get("/getAllUser", async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users);
        res.status(200).json({ message: "users Found  ", users });


    } catch (err) {
        res.status(400).json({ message: `something went wrong ${err}` });
    }
})


export default router;
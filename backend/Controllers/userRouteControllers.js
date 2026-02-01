import User from '../Models/userModels.js';
import bcrypt from 'bcryptjs';
import jwtToken from '../utils/jwtwebToken.js';

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(409).send({ success: false, message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilepic: gender === "male" ? profileBoy : profileGirl,
        });


        if (newUser) {
            await newUser.save();

            jwtToken(newUser._id, res);
        } else {
            return res.status(400).send({ success: false, message: "Error while registering user" });
        }

        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            profilepic: newUser.profilepic,
            gender: newUser.gender
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send({ success: false, message: "Internal Server Error during registration" });
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ success: false, message: "Invalid email or password" });
        }
        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return res.status(401).send({ success: false, message: "Invalid email or password" });
        }
        jwtToken(user._id, res);
        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
            message: "Login successful"
        })
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).send({ success: false, message: "Internal Server Error during login" });
    }
}

export const userLogout = (req, res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0,
        })
        res.status(200).send({ message: "Logout successful" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
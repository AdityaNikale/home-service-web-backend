const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { RegisterModel, ServiceModel} = require('../models/dbModels');
const verifyToken = require('../middleware/verifyToken');


const route = express.Router();


//token creation
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '5d' });
}

//Registeration API
route.post('/register', async (req, res) => {
    const {fname, email, password} = req.body;

    if (!fname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user with the same email already exists
        const existing = await RegisterModel.findOne({ email });

        if(existing) {
            res.status(200).json({message: "Email all ready exits"})
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //save user
        const newUser = new RegisterModel({
            fname,
            email,
            password: hashedPassword
        });

        const saveUser = await newUser.save();
        const token = createToken(saveUser._id);
        res.status(201).json({success: true, message: "User register successfull",
           token
        });

    } catch (error) {
        console.error("Registration error", error);
        res.status(500).json({ message: "Server error during registration" });
    }
});


//Login API
route.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body); 
    

     if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

    try {
        
        const user = await RegisterModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password"});
        }

        const token = createToken(user._id);
        res.status(200).json({success: true, message: "Login successful", token});

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }

})

// GET /api/search?keyword=cleaning&location=city
route.get("/search", async (req, res) => {
    const { keyword, location } = req.query;

    try {
        
        const service = await ServiceModel.find({
            name: { $regex: keyword, $options: 'i'},
            city: { $regex: location, $options: 'i'}
        });

        res.json(service);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// GET /api/services/:id
route.get('/:id', verifyToken,  async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = route;
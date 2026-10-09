const User = require("../model/auth.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

const genToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // 1. Check for missing required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill in all required fields." })
        }

        // 2. Check if user already exists
        const existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "User already exists with this email." })
        }

        // 3. Hash password and create user
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        
        const user = await User.create({
            username,
            email,
            password: hashPassword,
            role: 'user'
        })

        // 4. Send clean response along with JWT token
        return res.status(201).json({
            message: "User registered successfully",
            token: genToken(user._id, user.role),
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error("Register Error:", error.message);
        return res.status(500).json({ message: error.message || "Server Error" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // 1. Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide both email and password." })
        }

        // 2. Check user exist
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "No account found. Please register." })
        }

        // 3. Match password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password." })
        }

        // 4. Send response with Token & User object separately
        const token = genToken(user._id, user.role)

        return res.status(200).json({
            message: "Successfully logged in",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({ message: error.message || "Server Error" })
    }
}
// Auth Controller mein getMe function add karein
const getMe = async (req, res) => {
  try {
    // req.user Auth Middleware se aayega
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server Error" })
  }
}

module.exports = { register, login, getMe }
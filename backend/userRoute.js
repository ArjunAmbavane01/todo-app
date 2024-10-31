const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./User');
const JWT_SECRET = "arjunambavanesecretkey"
const auth = require('./auth');
const {z} = require('zod');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const requiredBody = z.object({
        email: z.string().max(100).min(3).email(),
        password : z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/\d/, { message: "Password must contain at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" })
    });
    const {success, data, error} = requiredBody.safeParse(req.body);
    if(!success){
        return res.json({
            type:"error",
            message:"Invalid Body sent",
            error
        })
    }
    const { email, password } = data;
    const hashedPassword = await bcrypt.hash(password,5);
    try {
        const user = await User.create({
            email,
            password:hashedPassword
        });

        res.json({
            type: 'success',
            msg: "User Created Successfully"
        })

    } catch (e) {
        res.json({
            type: "error",
            msg: e.message
        })
    }
})

router.post('/signin', async (req, res) => {
    const requiredBody = z.object({
        email: z.string().max(100).min(3).email(),
        password : z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/\d/, { message: "Password must contain at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" })
    });
    const {success, data, error} = requiredBody.safeParse(req.body);
    if(!success){
        return res.json({
            type:"error",
            message:"Invalid Body sent",
            error
        })
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const token = jwt.sign({ userId: user["_id"] }, JWT_SECRET);
                res.json({
                    type: "success",
                    token,
                    msg: "User Signed In Successfully"
                })
            }
            else {
                res.json({
                    type: "error",
                    msg: "Invalid Credentials"
                })
            }
        }
        else {
            res.json({
                type: "error",
                msg: "No User Found"
            })
        }

    } catch (e) {
        res.json({
            type: "error",
            msg: e.message
        })
    }

})

router.get('/me',auth, async (req, res) => {
    const user = await User.findOne({ _id: req.userId });
    if (user) {
        res.json({
            type: "success",
            msg: user.email
        })
    }
    else{
        res.json({
            type: "error",
            msg: "Authorization failed"
        })
    }
})

module.exports = router;
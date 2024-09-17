import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from "../config/emailConfig.js";

class UserController {
    static userRegisteration = async(req, res) => {

        const {name, email, password, password_confirmation, tc} = req.body;

        const user = await UserModel.findOne({email:email});
        
        if(user) {
            res.send(({"status": "failed", "message": "Email already exists"}))
        }
        else {
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                    
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password, salt)
                        
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc
                        });
                        await doc.save()

                        const save_user = await UserModel.findOne({email:email});

                        // generate jwt token
                        const token = jwt.sign({userId:save_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5D'});


                        res.status(201).send({"status": "success", "message": "Registration Success", "token": token})
                    } catch (error) {
                        console.log(error);
                        res.send({"status": "failed", "message": "Unable to register"})
                    }
                }
                else {
                    res.send(({"status": "failed", "message": "Password and confirmed password doesn`t match"}))
                }
            }
            else {
                res.send(({"status": "failed", "message": "All fields are required"}))
            }
        }

    }

    static userLogin = async (req, res) => {
        try {
            const {email, password} = req.body;

            if(email && password){
                const user = await UserModel.findOne({email: email});

                if(user !== null) {
                    const isMatch = await bcrypt.compare(password, user.password);

                    if(user.email === email && isMatch) {

                        // generate jwt token
                        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5D'});

                        res.status(200).send({"status": "success", "message": "Login success", "token": token})
                    }
                    else {
                        res.send({"status": "failed", "message": "Email or password is not valid"})
                    }
                }
                else {
                    res.send({"status": "failed", "message": "You are not a Registered User"})
                }
            }
            else {
                res.send({"status": "failed", "message": "All fields are required"})
            }
        } catch (error) {
            console.log(error);
            res.send({"status": "failed", "message": "Unable to login"})
        }
    }

    static changeUserPassword = async (req, res) => {

        const {password, password_confirmation} = req.body;

        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"status": "failed", "message": "New Password and confirm new password doesn`t match"});
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const newHashPassword = await bcrypt.hash(password, salt);

                // console.log(req.user);
                // console.log(req.user._id);

                await UserModel.findByIdAndUpdate(
                    req.user._id,
                    {$set: {
                        password: newHashPassword
                    }}
                )
                
                res.status(401).send({"status": "success", "message": "password change successfully"})
            }
        }
        else {
            res.send({"status": "failed", "message": "All fields are required"})
        }
    }

    static loggedUser = async (req, res) => {
        res.send({"user": req.user})
    }

    static sendUserPasswordResetEmail = async(req, res) => {
        const {email} = req.body

        if(email) {
            const user = await UserModel.findOne({email: email});
            // console.log(user);
            
            if(user){
                const secret = user._id + process.env.JEW_SECRET_KEY
                const token = jwt.sign({userId: user._id}, secret, {expiresIn: '2d'});
                const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`
                console.log(link);
                
                // /api/user/reset/:id/:token
                // send email
                // let info = await transporter.sendMail({
                //   from: process.env.EMAIL_FROM,
                //   to: user.email,
                //   subject: "GeekShop - Password Reset Link",
                //   html: `<a href=${link}>Click Here</a> to Reset Your Password`
                // })
                res.send({"status": "success", "message": "Password reset Email send... Please check your email"})
            }
            else {
                res.send({"status": "failed", "message": "Email doesn`t exists"});
            }
        }
        else {
            res.send({"status": "failed", "message": "Email field is required"})
        }
    }

    static userPasswordReset = async(req, res) => {
        const {password, password_confirmation} = req.body;
        const {id, token} = req.params

        const user = await UserModel.findById(id);
        const new_secret = user._id + process.env.JWT_SECRET_KEY;

        try {
            // console.log(req.params);
            
            jwt.verify(token, new_secret);
            
            if(password && password_confirmation){
                if(password !== password_confirmation){
                    res.send({"status": "failed", "message": "New password and confirm new password doesn`t match"})
                }
                else {
                    const salt = await bcrypt.genSalt(10);
                    const newHashPassword = await bcrypt.hash(password, salt);
                    await UserModel.findByIdAndUpdate(user._id, { $set: {password: newHashPassword}});
                    res.send({"status": "failed", "message": "Password reset successfully"})
                }
            }
            else {
                res.send({"status": "failed", "message": "All fields are required"})
            }
        } catch (error) {
            console.log(error);
            res.send({"status": "failed", "message": "Invalid Token"})
        }
    }   
}

export default UserController;




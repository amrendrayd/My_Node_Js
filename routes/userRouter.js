import express, { Router } from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/authMiddleware.js";

// Route level middleware - to protect route
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)

// public routes
router.post('/register', UserController.userRegisteration)
router.post('/login', UserController.userLogin);
router.post('/send-reset-password-eamil', UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)

// protected routes
router.post('/changepassword', UserController.changeUserPassword)
router.post('/loggeduser', UserController.loggedUser)



export default router;



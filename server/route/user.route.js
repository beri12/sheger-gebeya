import {Router} from 'express'
import { forgotPasswordController, loginController, logoutcontroller, refreshToken, regiserUserConroller, resetpassword, updateUserDetails, uploadAvatar, userDetails, verifyEmailController, verifyForgotPasswordOtp } from '../conrollers/user.conroller.js'

import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'


const userRouter = Router()

userRouter.post('/register', regiserUserConroller),
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout', auth,logoutcontroller)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth, userDetails)
export default userRouter
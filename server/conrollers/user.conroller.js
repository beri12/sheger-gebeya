import sendEmail from "../config/sendEmail.js"
import UserModel from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js"
import generatedAcessToken from "../utils/generatedAcessToken.js";
import genertedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

import genertadOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from 'jsonwebtoken'

import generatedOtp from "../utils/generatedOtp.js";





export  async function regiserUserConroller(request, response) {
    try {

        const {name, email, password} = request.body;

        if(!name || !email || !password) {
            return response.status(400).json({
                message : "provide email, name, password",
                error : true,
                sucess : false
            })
        }

        const user = await UserModel.findOne({ email}) 

        if(user){
            return response.json({
                message : "Already register email",
                error : true,
                sucess : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)
        

        const payload = {
            name, 
            email,
            password :  hashPassword 
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code={save?_id}`


        const verifyEmail =  await sendEmail({
            sendTo :  email,
            subject : "Verify email from sheger",
            html :  verifyEmailTemplate({
                name,
                url : verifyEmailUrl
            })
        })

        return response.json({
            message : "User register successfully",
            error :  false,
            sucess : true,
            data : save,
        })

 
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : false,
            sucess : true,
            data : save
        })
    }
}

export async function  verifyEmailController(request, response) {
    try {

        const {code} = request.body

        const user = await UserModel.findOne({ _id : code})

        if(!user){
            return response.status(400).json({
                message : "Invalid code",
                error : true,
                sucess : false
            })
        }

        const updateUser = await UserModel.updateOne({_id :code},{
            verify_emai : true
        })

        return response.json({
            message : "Verify email done",
            sucess : true,
            error : false
              
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            sucess : true
        })

    }
}

// login controller 

export async function loginController(request, response) {
    try {

        const {email, password } = request.body

        if(!email || !password){
            return response.status(400).json({
                message : "provide email, password",
                error : true,
                sucess : false
            })
        }

        const user = await UserModel.findOne({ email})

        if(!user){
            return response.status(400).json({
                message : "User not register",
                error : true,
                sucess : false
            })
        }

        if(user.status !== "Active"){
            return response.status(400).json({
                message : "contact to Admin",
                error : true,
                sucess : false
            })
        }


        const checkPassword = await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "check your password",
                error : true,
                sucess : false
            })
        }

        const acesstoken = await generatedAcessToken(user._id)
        const refreshtoken = await genertedRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_update : new Date()
        })

        const  cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite  : "None"
        }
        response.cookie('acessToken', acesstoken,cookiesOption)
        response.cookie('refreshToken', refreshtoken,cookiesOption)

        return response.json({
            message : "Login sucessfully",
            error : false,
            sucess : true,
            data : {
                acesstoken,
                refreshtoken
            }
        })

    } catch (error) {
      return response.status(500).json({
        message : error.message || error,
        error : true,
        sucess : false
      })
        


    }
}

// logoutcontroller 
export async function logoutcontroller(request, response) {
    try {
        const userId = request.userId // middelware
        const  cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite  : "None"
        }

        response.clearCookie("acesstoken",cookiesOption)
        response.clearCookie("refreshtoken",cookiesOption)


        const removeRefreshToken = await  UserModel.findByIdAndUpdate(userId, {
            refresh_token : ""

        })


      

        return response.json({
            message: "Logout Successfully",
            error: false,
            sucess: true

        })

     

    } catch(error) {
        return response.status(500).json({
            message:  error.message ||  error,
            error: true,
            sucess: false
        })
    }
}


// upload user  avatar 
export async  function  uploadAvatar(request, response){
    try {

        const userId = request.userId // auth middelware

        const image = request.file  // multer middeleware

        const upload  = await  uploadImageCloudinary(image)

        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url

        })

        return  response.json({
            message :  "upload profile",
            sucess : true,
            error : false,
            data :  {
                _id: userId,
                avatar : upload.url
            }
        })
        console.log("image",image)

    } catch (error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            sucess : false
        })

    }
}

// update user details 
export async function updateUserDetails(request, response){
    try {
        const userId = request.userId // auth middelware
        const {name, email, mobile, password} = request.body

        let  hashPassword = ""

        if(password) {
            const salt = await bcryptjs.genSalt(10)
         hashPassword = await bcryptjs.hash(password, salt)

        }

        const updateUser = await UserModel.updateOne({_id:userId}, {
            ...(name && { name : name }),
            ...(email && { email : email}),
            ...(mobile && { mobile : mobile}),
            ...(password && { password : password}),

        })

        return response.json({
            message : "updated successfully",
            error : false,
            sucess : true,
            data : updateUser
        })

    } catch (error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            sucess : fasle
        })
    }
}

// forgot password not  login



export async function forgotPasswordController(request,response) {
    try {
        const { email } = request.body 

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000 // 1hr

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "Forgot password from Binkeyit",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return response.json({
            message : "check your email",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}



// 
export async function verifyForgotPasswordOtp(request,response){
    try {
        const { email , otp }  = request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "Provide required field email, otp.",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime  ){
            return response.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return response.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// reset the password 
export async function resetpassword(request,response){
    try {
        const { email , newPassword, confirmPassword} = request.body

        if(!email|| !newPassword || !confirmPassword){
            return response.status(400).json({
                message : "provide required field email,newpassword, confirmpassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email is not available",
                error : true,
                sucess : false
            })
        }


        const  currentTime =  new Date().toISOString()
        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message: "new password and confirm password not same",
                error : true,
                sucess : false,
            })
        }


        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
           password :  hashPassword 

        })

        return response.json({
            message : "password updated succesfully",
            error : false,
            sucess : true
        })



    } catch (error){
        return response.ststus(500).json({
            message : error.message  || error,
            error : true,
            sucess : false
        })
    }
}
    

// refresh token
export async  function refreshToken(request,response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split()[1] //  beear token

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error : true,
                sucess : false
            })
        }

        const verificationToken =  await jwt.verify(refreshToken,
            process.env.SECRET_KEY_REFRESH_TOKEN)
          

            if(!verifyToken){
                return response.status(401).json({
                    message : "token is expired",
                    error : true,
                    sucess : false
                })
            }


            const userId = verifyToken._id

            const newAccessToken = await  generatedAcessToken(userId)

            const  cookiesOption = {
                httpOnly : true,
                secure : true,
                sameSite  : "None"
            }


            response.cookies('accessToken',newAccessToken,cookiesOption)

            return response.json({
                message : "New Access token generated",
                error : false,
                sucess : true,
                data : {
                    accessToken : newAccessToken
                }
            })

    } catch (error) {
        return response.status(500).json({
            message : error.message  ||  error,
            error : true,
            sucess : false
        })
    }
}

// get  login user Details 
export async function userDetails(request,response) {
    try {

        const userId = request.userId

        console.log(userId)

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            sucess : true

        })

    } catch (error) {
        return response.status(500).json({
            message : "something is wrong",
            error : true,
            sucess : false

        })

    }
    
}
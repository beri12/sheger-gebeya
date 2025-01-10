import jwt from 'jsonwebtoken'

const generatedAcessToken = async(userId)=>{
    const token = await jwt.sign({id : userId},
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn : '7d'},
    )

    return token
    
}


export default generatedAcessToken

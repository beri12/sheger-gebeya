const verifyEmailTemplate = (name, url)=>{
    return `
    <p>Dear ${name} </p>
    <p>Thank you for registering Sheger.</p>
    <a  href=${url}style="color:white;background : blue;margin-top : 10px">
    
    VerifyEmail
    </a>
    `
}

export default verifyEmailTemplate
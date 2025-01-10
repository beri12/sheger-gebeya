const forgotPasswordTemplate = ({ name, otp })=> {
    

    return `

    <div>
    <p>Dear, ${name}</p>
    <p>You're requested a password reset. Please use the following otp 
    code  to reset the password.</p>
    <div style="background:yellow;font-size:20px padding:20px;
    text-align:center;font-weight: 800;">
    ${otp}
    </div>
    <p>is valid for 1 hour only.Enter this otp in the sheger
     website to proceed with restarting your password.</p>
     <br />
     </br>
     <p>Thanks</p>
     <p>Sheger</p>
    </div>
    
    `
}

export default forgotPasswordTemplate
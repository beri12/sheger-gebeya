const generatedOtp = () => {
    return Math.floor(Math.random() * 90000) +  10000 ///  10000 to 999999
}
export  default generatedOtp
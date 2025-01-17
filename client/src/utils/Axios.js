import axios from  'axios'
import SummaryApi, {baseURL} from "../common/SummartApi"

const Axios = axios.create({
    baseURL : baseURL,
    withCredentials : true
})

// sending access token in header
Axios.interceptors.request.use(
    async(config)=>{

        const accessToken = localStorage.getItem('accesstoken')

        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

// extend the life span of access token with  the help refresh
Axios.interceptors.request.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originRequest = error.config
        if(error.response.status === 401 && !originRequest.retry){
            originRequest.retry = true
            const refreshToken = localStorage.getItem("refreshToken")

            if(refreshToken){
                const newAcessToken = await refreshAcessToken(refreshToken)

                if(newAcessToken){
                    originRequest.headers.Authorization = `Bearer ${newAcessToken}`

                }
            }
        }

        return Promise.reject(error)
    }
)

const refreshAcessToken = async(refreshToken)=>{
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers : {
                Authorization : `Bearer ${refreshToken}`
            }
        })

        const accessToken = response.data.data.accessToken
        localStorage.setItem('acesstoken', accessToken)
        return accessToken
    } catch (error) {
        console.log(error)
    }
}


export default  Axios
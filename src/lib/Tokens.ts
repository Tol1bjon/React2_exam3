import axios from "axios";


// 1.
export const saveToken = (token: any, refresh: any) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refresh', refresh)
}


// 2.
export const getToken = () => {
    return localStorage.getItem('token')
}


// 3.
export const getRefreshToken = () => {
    return localStorage.getItem('refresh')
}


// 4. 
export const removeToken = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    localStorage.removeItem('payments')
}

// Универсальная функция выхода из системы
export const logoutUser = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
            await axiosRequest.post('/api/auth/logout', { refreshToken });
        }
    } catch (error) {
        console.log('Logout error:', error);
    } finally {
        removeToken();
        window.location.href = '/login_and_register';
    }
};


// 5.
export const axiosRequest = axios.create({
    baseURL: import.meta.env.VITE_API
})


// 6.
axiosRequest.interceptors.request.use((config) => {
    const token = getToken()
    if(token) {
       config.headers['Authorization'] = `Bearer ${token}` 
    }
    return config
})


// 7.
axiosRequest.interceptors.response.use(
    (response) => response,

    async (error) => {
        if(error.response?.status == 401 && !error.config?._retry){
            error.config._retry = true

            try {
                const refreshToken = getRefreshToken()
                if(!refreshToken){
                    throw new Error('No refresh token')
                }
                
                const {data} = await axios.post(`${import.meta.env.VITE_API}/api/auth/refresh`,
                    { refreshToken }
                )

                saveToken(data.accessToken, data.refreshToken)
                error.config.headers['Authorization'] = `Bearer ${data.accessToken}`
                return axiosRequest(error.config)
            } catch (error) {
                removeToken()
                window.location.href = '/login_and_register'
            }
        }

        return Promise.reject(error)
    }
)
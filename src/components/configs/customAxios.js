import axios from 'axios'
import { BACKEND_ROOT_URL, base_json_header, FRONTEND_ROOT_URL } from '../../constants'

const customAxios = axios.create({
    baseURL: BACKEND_ROOT_URL,
    timeout: 10000,
    headers: base_json_header,
    withCredentials: true
})

customAxios.interceptors.response.use(undefined, async function (err) {
    if(err.response.status === 401){
        if(err.response.data.code === 'ROTATE_ACCESS'){
            // Time to refresh stale access token
            const res = await fetch(`${BACKEND_ROOT_URL}/auth2/update_access_token/`, {
                method: 'POST',
                headers: base_json_header,
                credentials: 'include',
                body: JSON.stringify({
                    'grant_type': 'refresh_token',
                    'refresh_token': err.response.data['refresh']
                })
            })
            if(res.status !== 200){
                // AGHHH, redirect this to signin
                window.location.href = `${FRONTEND_ROOT_URL}/signin?msg_code=signin_to_continue&next=${encodeURIComponent( typeof window === 'undefined' ? FRONTEND_ROOT_URL :  window.location.href)}`
            }
        } else if (err.response.data.code === 'REQUIRED_RELOGIN'){
            window.location.href = `${FRONTEND_ROOT_URL}/signin?msg_code=signin_to_continue&next=${encodeURIComponent( typeof window === 'undefined' ? FRONTEND_ROOT_URL :  window.location.href)}`
        }

        const res = await customAxios.request(err.config);

        return res

    }else {
        return Promise.reject(err);
    }
});

export default customAxios;
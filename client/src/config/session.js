import Cookies from 'js-cookie'

export const getAccessToken = () => Cookies.get('access_token')
export const isAuthenticated = () => !!getAccessToken()
export const setAccessToken = (token) => Cookies.set('access_token',token)
export const removeAccessToken = () => {
    Cookies.remove('access_token')
    Cookies.remove('id')
    Cookies.remove('first_name')
    Cookies.remove('profile_url')
}
export const setUserInfo = (id, firstName, url) => {
    Cookies.set('id',id)
    Cookies.set('first_name',firstName)
    Cookies.set('profile_url',url)
}
export const getUserInfo = () => {
    return {
        id:Cookies.get('id'),
        firstName:Cookies.get('first_name'),
        url:Cookies.get('profile_url')
    }
}

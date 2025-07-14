import * as Keychain from 'react-native-keychain';
import { jwtDecode } from 'jwt-decode';



export const getValidAccessToken = async (): Promise<string | null> => {
    const access = await Keychain.getGenericPassword({service: "access_token"})
    const refresh = await Keychain.getGenericPassword({service: "refresh_token"})

    if (!access || !refresh) return null;

    const accessToken = access.password;
    const refreshToken = refresh.password;

    try{
        const decoded = jwtDecode(accessToken);
        const now = Date.now() / 1000;

        if (decoded.exp){
            if (decoded.exp > now){
                return accessToken
            }
            else{
                const response = await fetch("https://kick-stand-k2g2.onrender.com/api/auth/google/refresh_token", {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });
                if (!response.ok) return null;

                const { access_token } = await response.json();
                await Keychain.setGenericPassword('access_token', access_token, { service: 'access_token' });
                return access_token;
            }
        } 
        else{
            return null;
        } 
    } catch (err) {
        console.error("Token decode/refresh error:", err);
        return null;
    }

}
import axios from 'axios';
import React, { useEffect, useState } from 'react';
// คุณยังคงใช้ประเภทการตอบกลับที่กำหนดเอง
interface UserProfile {
    userId: string;
    displayName: string;
    pictureUrl: string;
    access_token: string;
}
interface TokenResponse {
    access_token: string;
}
const CallbackScreen: React.FC = () => {
    const [lineId, setLineId] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [pictureUrl, setPictureUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const code = new URLSearchParams(window.location.search).get('code');
    console.log("code--------->", code);
    useEffect(() => {
        if (code) {
            getAccessToken(code);
        }
    }, [code]);

    const getAccessToken = async (code: string) => {
        try {
            const clientId = '2007008919';
            const clientSecret = '13f249f6e77cea7147a9ed58d9f6e319';
            const redirectUri = 'https://oho-pos.com/line-auth/callback';
            const response = await axios.post(
                'https://api.line.me/oauth2/v2.1/token',
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: redirectUri,
                    client_id: clientId,
                    client_secret: clientSecret,
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            console.log("response--------->", response.data);
            const accessToken = (response.data as TokenResponse).access_token;
            console.log("accessToken--------->", accessToken);
            if (accessToken) {
                getUserProfile(accessToken);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error getting access token:', error);
            setIsLoading(false);
        }
    };

    const getUserProfile = async (accessToken: string) => {
        try {
            const response = await axios.get<UserProfile>('https://api.line.me/v2/profile', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log("getUserProfile response--------->", response.data);
            setLineId(response.data.userId);
            setDisplayName(response.data.displayName);
            setPictureUrl(response.data.pictureUrl);
            setIsLoading(false);
        } catch (error) {
            console.error('Error getting profile:', error);
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                //center 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                height: '100vh',
                width: '100vw',
                //center
            }}
        >
            <h1>LINE Callback</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {lineId && (
                        <div
                            style={
                                {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignSelf: 'center',
                                }
                            }

                        >
                            {pictureUrl ? (
                                <img src={pictureUrl} alt="Profile" width={100} height={100} />
                            ) : (
                                <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#ccc' }} />
                            )}
                            <h2>{displayName}</h2>
                            <p>ID: {lineId}</p>
                        </div>
                    )}
                    {!lineId && <p>Unable to fetch LINE profile.</p>}
                </div>
            )}
        </div>
    );
};

export default CallbackScreen;

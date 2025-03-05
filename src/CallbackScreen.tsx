import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 3000 }
            );

            const accessToken = (response.data as TokenResponse).access_token;
            if (accessToken) {
                getUserProfile(accessToken);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error getting access token:', error);

            setIsLoading(false);
            //back to home
            window.location.href = 'https://oho-pos.com/line-auth/';
        }
    };

    const getUserProfile = async (accessToken: string) => {
        try {
            const response = await axios.get<UserProfile>('https://api.line.me/v2/profile', {
                headers: { Authorization: `Bearer ${accessToken}`, timeout: 3000 },
            });

            setLineId(response.data.userId);
            setDisplayName(response.data.displayName);
            setPictureUrl(response.data.pictureUrl);
            setIsLoading(false);
        } catch (error) {
            console.error('Error getting profile:', error);
            setIsLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!lineId) return;
        try {
            const token = 'SEa9JerSUgzsjcF3FgdcPgrOTJ44/Eix//IYZbrGmQDd4wABRES6kVK1ZILgMql/dUDezLGaD4dqbwBL9+/Sd1zlcKRUqlxhD+emtwyBePuyEChOw0MwlyARE+tVh0c2TuMDArZLw40TO4Q+byAfpAdB04t89/1O/w1cDnyilFU=';
            const response = await axios.post(
                'https://api.line.me/v2/bot/message/push',
                {
                    to: lineId,
                    messages: [
                        {
                            type: 'text',
                            text: `สวัสดี ${displayName}! นี่คือข้อความจาก LINE Bot 🎉`,
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        timeout: 3000,
                    },
                }
            );
            console.log(response.data);
            alert('ส่งข้อความสำเร็จ!');
        } catch (error: any) {
            console.error('Error sending message:', error);
            if (error.response) {
                // Axios Error
                alert(`Error from server: ${error.response.data}`);
            } else if (error.request) {
                // No response was received
                alert('No response received from server');
            } else {
                // General error
                alert('Error in setting up the request: ' + error.message);
            }
        }
    };


    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
            }}
        >
            <h1>LINE Callback</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    {lineId ? (
                        <>
                            {pictureUrl ? (
                                <img src={pictureUrl} alt="Profile" width={100} height={100} />
                            ) : (
                                <div
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        backgroundColor: '#ccc',
                                    }}
                                />
                            )}
                            <h2>{displayName}</h2>
                            <p>ID: {lineId}</p>
                            <button
                                style={{
                                    marginTop: 10,
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                }}
                                onClick={sendMessage}
                            >
                                ส่งข้อความถึง LINE
                            </button>
                        </>
                    ) : (
                        <p>ไม่สามารถดึงข้อมูล LINE ได้</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CallbackScreen;

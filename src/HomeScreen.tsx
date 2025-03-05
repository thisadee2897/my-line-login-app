// src/HomeScreen.tsx
import React from 'react';

const HomeScreen: React.FC = () => {
    const handleLogin = () => {
        const clientId = '2007008919';
        const redirectUri = 'https://oho-pos.com/line-auth/callback'; // ปรับให้ตรงกับ URL ของคุณ
        const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=random_state&scope=profile%20openid%20email`;

        // Redirect ไปยังหน้า Login ของ LINE
        window.location.href = loginUrl;
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
            <h1>LINE Login</h1>
            <button onClick={handleLogin}>Login with LINE</button>
        </div>
    );
};

export default HomeScreen;

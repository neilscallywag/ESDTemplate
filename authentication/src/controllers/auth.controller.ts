import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { createAccessToken } from '../middlewares/jwtMiddleware';

const handleGoogleCallback = async (req: Request, res: Response) => {
    const code = req.body?.code; 
    if (!code) {
        return res.status(400).json({ error: 'Code is missing' });
    }

    try {
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage'
        );
    
        const { tokens } = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(tokens);

        // this userAuth is an object returned from google oauth and contains access token that could be used to retrieve user data
        const userAuth = oAuth2Client.credentials;

        // TODO: set database user idk waht database


        // After setting database user create jwt token with user's id and role or whatever
        const { accessToken, accessCookieOptions } = createAccessToken('userid', 'role');
        
        // TODO: set redis user:jwt token idk how connect redis


        res.cookie('access_token', accessToken, accessCookieOptions);
        res.status(200).json({ success: true, userAuth });
      
    } catch (error) {
        res.status(401).json({ error: 'OAuth callback failed' });
    }
};

export const authController = {
    handleGoogleCallback,
};
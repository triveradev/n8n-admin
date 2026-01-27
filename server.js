require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const N8N_URL = process.env.N8N_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;
const APP_ACCESS_CODE = process.env.APP_ACCESS_CODE;

if (!N8N_URL || !N8N_API_KEY || !APP_ACCESS_CODE) {
    console.error('ERROR: N8N_URL, N8N_API_KEY, and APP_ACCESS_CODE must be set in .env file');
    process.exit(1);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/add-user', async (req, res) => {
    const { email, accessCode } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            error: 'Email is required'
        });
    }

    if (!accessCode) {
        return res.status(400).json({
            success: false,
            error: 'Access code is required'
        });
    }

    if (String(accessCode) !== String(APP_ACCESS_CODE)) {
        return res.status(401).json({
            success: false,
            error: 'Invalid access code. Please try again.'
        });
    }

    const firstName = 'Student';
    const lastName = 'User';

    try {
        const existingUsersResponse = await axios.get(
            `${N8N_URL}/api/v1/users`,
            {
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const existingUsersPayload = existingUsersResponse.data;
        const existingUsers = Array.isArray(existingUsersPayload)
            ? existingUsersPayload
            : (existingUsersPayload?.data || existingUsersPayload?.users || []);

        const normalizedEmail = String(email).trim().toLowerCase();
        const emailAlreadyInUse = existingUsers.some((u) => {
            const uEmail = u?.email;
            if (!uEmail) return false;
            return String(uEmail).trim().toLowerCase() === normalizedEmail;
        });

        if (emailAlreadyInUse) {
            return res.status(409).json({
                success: false,
                error: 'This email is already registered. Please enter a different email.'
            });
        }

        const response = await axios.post(
            `${N8N_URL}/api/v1/users`,
            [{
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: 'global:member'
            }],
            {
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const userData = response.data[0] || response.data;
        
        console.log('N8N API Response:', JSON.stringify(response.data, null, 2));
        console.log('User Data:', JSON.stringify(userData, null, 2));
        
        const inviteAcceptUrl = userData.inviteAcceptUrl || 
                                userData.data?.inviteAcceptUrl || 
                                userData.user?.inviteAcceptUrl ||
                                userData.inviteUrl;

        if (!inviteAcceptUrl) {
            console.error('No invite URL found in response. Full userData:', userData);
            return res.status(500).json({
                success: false,
                error: 'User created but no invitation link was returned',
                debug: userData
            });
        }

        res.json({
            success: true,
            message: 'User added successfully',
            inviteUrl: inviteAcceptUrl,
            user: {
                email: email
            }
        });

    } catch (error) {
        console.error('Error adding user to N8N:', error.response?.data || error.message);
        
        let errorMessage = 'Failed to add user to N8N';
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(error.response?.status || 500).json({
            success: false,
            error: errorMessage
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', n8nUrl: N8N_URL });
});

app.listen(PORT, () => {
    console.log(`N8N User Manager running on port ${PORT}`);
    console.log(`N8N Instance: ${N8N_URL}`);
});

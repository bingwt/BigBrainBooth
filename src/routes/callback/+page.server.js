import { redirect } from '@sveltejs/kit';
import { createProfile, getProfile } from '$lib/pocketbase';

export async function load({ url, fetch, cookies }) {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
        throw redirect(303, '/signin');
    }

    const token_response = await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: import.meta.env.VITE_42API_UID,
            client_secret: import.meta.env.VITE_42API_SECRET,
            code: code,
            redirect_uri: import.meta.env.VITE_42API_CALLBACK
        })
    });

    if (!token_response.ok) {
        console.error('Authentication failed');
        throw redirect(303, '/signin');
    }

	const tokenData = await token_response.json();

    const user_response = await fetch('https://api.intra.42.fr/v2/me', {
        headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
        }
    });

    if (!user_response.ok) {
        console.error('Failed to fetch user details');
        throw redirect(303, '/signin');
    }

    const userData = await user_response.json();

    const session = {
        id: crypto.randomUUID(),
        user: {
            id: userData.id,
            login: userData.login,
            email: userData.email,
            name: userData.displayname,
			image: userData.image.link
        }
    };

    const profile = await getProfile(userData.login);
    if (profile.length === 0) {
        await createProfile({
            login: userData.login,
            votes: {
                up: [],
                down: []
            },
            saves: [],
            comments: []
        });
    }

    cookies.set('session', JSON.stringify(session), {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24
    });

    throw redirect(303, '/');
}
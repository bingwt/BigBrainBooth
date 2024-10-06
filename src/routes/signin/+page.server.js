import { redirect } from '@sveltejs/kit';

export function load({ url }) {
    const clientId = import.meta.env.VITE_42API_UID;
    const redirectUri = import.meta.env.VITE_42API_CALLBACK;
    const scope = 'public';
    const state = crypto.randomUUID();

    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}`;

    return {
        headers: {
            'Set-Cookie': `oauth_state=${state}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`
        },
        authUrl
    };
}
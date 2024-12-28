import { createCookie } from '@vercel/remix';

export const authCookie = createCookie('authentication', {
    maxAge: 604_800,
});

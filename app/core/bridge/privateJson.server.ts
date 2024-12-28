import { json } from '@vercel/remix';

export function privateJson(data: any, init?: number | ResponseInit) {
    let responseInit =
        typeof init === 'number'
            ? {
                  status: init,
              }
            : init;
    let headers = new Headers(responseInit?.headers);
    return json(data, {
        headers: {
            'Cache-Control': 'private',
        },
        ...headers,
    });
}

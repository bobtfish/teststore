import { LoaderFunction, LoaderFunctionArgs, json } from '@vercel/remix';
import { getContext } from '~/use-cases/http/utils';
import fetchPickupPoints from '~/use-cases/payments/montonio/fetchPickupPoints';
import { storage } from '~/use-cases/services.server';
import { getStoreFront } from '~/use-cases/storefront.server';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
    if (params.provider !== 'montonio') {
        return json({ error: 'Provider not supported' }, { status: 400 });
    }
    const cached = await storage.get('montonio-pickup-points');
    if (cached) {
        return json(JSON.parse(cached));
    }
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const points = await fetchPickupPoints(storefront.config);
    // AS per documentation we are going to cache this for 24 hours
    storage.set('montonio-pickup-points', JSON.stringify(points), 86400);
    return json(points);
};

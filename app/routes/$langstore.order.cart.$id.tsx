import { json, LoaderFunction, HeadersFunction, LoaderFunctionArgs } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getStoreFront } from '~/use-cases/storefront.server';
import { getContext } from '~/use-cases/http/utils';
import OrderPlacedCart from '~/ui/pages/OrderPlacedCart';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
    const requestContext = getContext(request);
    const { shared } = await getStoreFront(requestContext.host);
    return json(
        { cartId: params.id },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['cart' + params.id], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { cartId } = useLoaderData<typeof loader>();
    return <OrderPlacedCart cartId={cartId} />;
};

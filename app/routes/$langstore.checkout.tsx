import { HttpCacheHeaderTaggerFromLoader } from '~/use-cases/http/cache';
import { HeadersFunction, LinksFunction, LoaderFunction, LoaderFunctionArgs } from '@vercel/remix';
import { isAuthenticated as isServerSideAuthenticated } from '~/core/authentication.server';
import { useLoaderData } from '@remix-run/react';
import { privateJson } from '~/core/bridge/privateJson.server';
import Checkout from '~/ui/pages/Checkout';
import AdyenDefaultTheme from '@adyen/adyen-web/dist/adyen.css?url';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
    return privateJson({
        isServerSideAuthenticated: await isServerSideAuthenticated(request),
    });
};

export const links: LinksFunction = () => {
    return [
        {
            rel: 'stylesheet',
            href: AdyenDefaultTheme,
        },
    ];
};

export default () => {
    const { isServerSideAuthenticated } = useLoaderData<typeof loader>();
    return <Checkout isServerSideAuthenticated={isServerSideAuthenticated} />;
};

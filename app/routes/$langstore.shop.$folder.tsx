import {
    HeadersFunction,
    json,
    LinksFunction,
    LoaderFunction,
    LoaderFunctionArgs,
    MetaFunction,
} from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import sliderStyles from 'rc-slider/assets/index.css?url';
import { getStoreFront } from '~/use-cases/storefront.server';
import { buildMetas } from '~/use-cases/MicrodataBuilder';
import { getContext } from '~/use-cases/http/utils';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css?url';
import videoStyles from '@crystallize/reactjs-components/assets/video/styles.css?url';
import Category from '~/ui/pages/Category';
import dataFetcherForShapePage from '~/use-cases/dataFetcherForShapePage.server';
import { authenticatedUser } from '~/core/authentication.server';
import { marketIdentifiersForUser } from '~/use-cases/marketIdentifiersForUser';

export const links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: sliderStyles },
        { rel: 'stylesheet', href: splideStyles },
        { rel: 'stylesheet', href: videoStyles },
    ];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }: { data: any }) => {
    return buildMetas(data?.data?.category);
};

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
    const requestContext = getContext(request);
    const path = `/shop/${params.folder}`;
    const { shared } = await getStoreFront(requestContext.host);
    const user = await authenticatedUser(request);
    const data = await dataFetcherForShapePage(
        'category',
        path,
        requestContext,
        params,
        marketIdentifiersForUser(user),
    );

    return json({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { data } = useLoaderData<typeof loader>();
    return <Category data={data} />;
};

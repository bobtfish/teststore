import { HeadersFunction, json, LoaderFunction, LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';
import { useLoaderData } from '@remix-run/react';
import { buildMetas } from '~/use-cases/MicrodataBuilder';
import Product from '~/ui/pages/Product';
import Category from '~/ui/pages/Category';
import AbstractStory from '~/ui/pages/AbstractStory';
import Topic from '~/ui/pages/Topic';
import LandingPage from '~/ui/pages/LandingPage';
import dataFetcherForShapePage from '~/use-cases/dataFetcherForShapePage.server';
import Stories from '~/ui/pages/Stories';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }: { data: any }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
    const requestContext = getContext(request);
    const { shared, secret } = await getStoreFront(requestContext.host);
    const path = '/' + params['*'];
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: requestContext.language,
        isPreview: requestContext.isPreview,
    });
    const shapeData = await api.fetchShapeIdentifier(path);
    const shapeIdentifier = shapeData?.shape?.identifier || '_topic';

    if (!shapeIdentifier) {
        throw new Response('Not Found', {
            status: 404,
        });
    }

    const data = await dataFetcherForShapePage(shapeIdentifier, path, requestContext, params);

    return json(
        { shapeIdentifier, data },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { data, shapeIdentifier } = useLoaderData<typeof loader>();
    switch (shapeIdentifier) {
        case 'product':
            return <Product data={data} />;
        case 'category':
            return <Category data={data} />;
        case 'folder':
            return <Stories folder={data} />;
        case 'abstract-story':
        case 'story':
        case 'curated-product-story':
            return <AbstractStory data={data} />;
        case '_topic':
            return <Topic data={data} />;
        case 'landing-page':
            return <LandingPage data={data} />;
        default:
            return <p>There is no renderer for that page</p>;
    }
};

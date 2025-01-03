import { ActionFunction, ActionFunctionArgs, json } from '@vercel/remix';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import purgeKeys from '~/use-cases/http/fastly/purgeKeys';

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    // we keep it simple for now and we purge all cache for the tenant identifier
    const keys = [storefront.config.tenantIdentifier];
    const keyPurged = await purgeKeys(keys);
    return json({
        message: `${Object.keys(keyPurged).length} key(s) soft purged.`,
        keys: keyPurged,
    });
};

import { LoaderFunction, LoaderFunctionArgs, redirect } from '@vercel/remix';
import { availableLanguages } from '~/use-cases/LanguageAndMarket';
export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
    return redirect('/' + availableLanguages[0] + '/' + params['*'], 301);
};

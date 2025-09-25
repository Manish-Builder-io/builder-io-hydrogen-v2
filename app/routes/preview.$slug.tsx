import {Content, fetchOneEntry, isPreviewing, getBuilderSearchParams} from '@builder.io/sdk-react';
import {Link, useLoaderData} from 'react-router';
import {useNonce} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {CUSTOM_COMPONENTS} from '~/../builder-registry';

const MODEL = 'page';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const apiKey =
    context.env.PUBLIC_BUILDER_API_KEY ||
    context.env.VITE_PUBLIC_BUILDER_KEY ||
    url.searchParams.get('builder.publicApiKey') ||
    url.searchParams.get('builder.space') ||
    '';
  const pathname = `/${params.slug ?? ''}`;

  const content = apiKey
    ? await fetchOneEntry({
        model: MODEL,
        apiKey,
        userAttributes: {urlPath: pathname},
        options: getBuilderSearchParams(url.searchParams),
      })
    : null;

  // debug: api key loaded from env or URL

  return {
    content,
    model: MODEL,
    searchParams: Object.fromEntries(url.searchParams),
    apiKey,
  };
}

// Disable caching for preview responses
export const headers = () => ({
  'Cache-Control': 'no-store, no-cache, must-revalidate',
});

function LinkComponent(props: any) {
  return <Link {...props} to={props.href} />;
}

export default function PreviewPage() {
  const {content, model, searchParams, apiKey} = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const show = content || isPreviewing(searchParams);
  return show ? (
    <Content
      model={model}
      apiKey={apiKey}
      content={content}
      nonce={nonce}
      linkComponent={LinkComponent}
      customComponents={CUSTOM_COMPONENTS}
    />
  ) : (
    <div>404</div>
  );
}



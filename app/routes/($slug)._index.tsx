import {Content, fetchOneEntry, isPreviewing, getBuilderSearchParams} from '@builder.io/sdk-react';
import {Link, useLoaderData} from 'react-router';
import {useNonce} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {CUSTOM_COMPONENTS} from '~/../builder-registry';

const model = 'page';

export async function loader({request, context}: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const apiKeyFromEnv =
      context.env.PUBLIC_BUILDER_API_KEY || context.env.VITE_PUBLIC_BUILDER_KEY;
    const apiKeyFromUrl =
      url.searchParams.get('builder.space') ||
      url.searchParams.get('apiKey') ||
      url.searchParams.get('builder.publicApiKey') ||
      '';
    const apiKey = apiKeyFromEnv || apiKeyFromUrl || '';

    const content = apiKey
      ? await fetchOneEntry({
          model,
          apiKey,
          userAttributes: {
            urlPath: url.pathname,
          },
          options: getBuilderSearchParams(url.searchParams),
        })
      : null;

    return {
      content,
      model,
      searchParams,
      apiKey,
    };
  } catch (e) {
    console.error(e);
    return {content: null, model, searchParams: {}, apiKey: ''};
  }
}

function LinkComponent(props: any) {
  return <Link {...props} to={props.href} />;
}

export default function BuilderPage() {
  const {content, model, searchParams, apiKey} = useLoaderData<typeof loader>();
  const nonce = useNonce();

  const canShowContent = content || isPreviewing(searchParams);

  return (
    <div>
      {canShowContent ? (
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
      )}
    </div>
  );
}



import type {AppLoadContext} from '@shopify/remix-oxygen';
import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  // Extend CSP to allow Builder and local assets for images and tracking requests
  let updatedHeader = header;
  const ensureSources = (
    directive: 'img-src' | 'connect-src',
    required: string[],
  ) => {
    if (new RegExp(`${directive}\\s`).test(updatedHeader)) {
      updatedHeader = updatedHeader.replace(
        new RegExp(`${directive}\\s+([^;]+)`),
        (match, sources) => {
          const missing = required.filter((s) => !sources.includes(s));
          return missing.length ? `${directive} ${sources} ${missing.join(' ')}` : match;
        },
      );
    } else {
      updatedHeader += `; ${directive} ${required.join(' ')}`;
    }
  };

  ensureSources('img-src', [
    "'self'",
    'data:',
    'blob:',
    'https://cdn.builder.io',
    'https://cdn.shopify.com',
    'https://shopify.com',
    'http://localhost:*',
  ]);

  ensureSources('connect-src', [
    'https://cdn.builder.io',
    'https://cdn.builder.codes',
  ]);

  responseHeaders.set('Content-Security-Policy', updatedHeader);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

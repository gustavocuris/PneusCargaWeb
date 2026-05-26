type SiteContent = {
  tireShowcaseSlides: unknown[];
  galleryImages: unknown[];
  stores: unknown[];
};

type Env = {
  ASSETS: Fetcher;
  SITE_CONTENT?: KVNamespace;
};

const contentKey = 'site-content';
const employeePassword = 'IPN@2026';

function jsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...init?.headers,
    },
  });
}

function isValidContent(content: SiteContent) {
  return (
    Array.isArray(content.tireShowcaseSlides) &&
    Array.isArray(content.galleryImages) &&
    Array.isArray(content.stores)
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/site-content' && request.method === 'GET') {
      if (!env.SITE_CONTENT) {
        return jsonResponse({ message: 'SITE_CONTENT KV binding missing.' }, { status: 503 });
      }

      const content = await env.SITE_CONTENT.get(contentKey, 'json');

      if (!content) {
        return jsonResponse({ message: 'No saved content yet.' }, { status: 404 });
      }

      return jsonResponse(content);
    }

    if (url.pathname === '/api/site-content' && request.method === 'PUT') {
      if (!env.SITE_CONTENT) {
        return jsonResponse({ message: 'SITE_CONTENT KV binding missing.' }, { status: 503 });
      }

      if (request.headers.get('X-Employee-Password') !== employeePassword) {
        return jsonResponse({ message: 'Unauthorized.' }, { status: 401 });
      }

      const content = (await request.json()) as SiteContent;

      if (!isValidContent(content)) {
        return jsonResponse({ message: 'Invalid site content.' }, { status: 400 });
      }

      await env.SITE_CONTENT.put(contentKey, JSON.stringify(content));
      return jsonResponse({ ok: true });
    }

    return env.ASSETS.fetch(request);
  },
};

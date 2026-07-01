function createApiClient({ baseUrl, apiKey = '', jwt = '' } = {}) {
  const buildUrl = (path) => `${baseUrl}${path}`;

  const request = async (path, options = {}) => {
    const { auth = 'none', headers = {}, body, method = 'GET' } = options;
    const requestHeaders = { ...headers };

    if (auth === 'apiKey' && apiKey) {
      requestHeaders['x-api-key'] = apiKey;
    }

    if (auth === 'jwt' && jwt) {
      requestHeaders.Authorization = `Bearer ${jwt}`;
    }

    if (body && !requestHeaders['Content-Type']) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(buildUrl(path), {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
    }

    return data;
  };

  return {
    setApiKey(value) {
      apiKey = value;
    },
    setJwt(value) {
      jwt = value;
    },
    get(path, options) {
      return request(path, { ...options, method: 'GET' });
    },
    post(path, body, options) {
      return request(path, { ...options, method: 'POST', body });
    },
    request,
  };
}
const API_BASE = 'http://localhost:3000';
const OUT = document.getElementById('out');
const api = createApiClient({ baseUrl: API_BASE });

function log(value) {
  OUT.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

async function getWithApiKey() {
  api.setApiKey('MY_API_KEY');
  log(await api.get('/', { auth: 'apiKey' }));
}

async function getWithJwt() {
  api.setJwt('YOUR_JWT_TOKEN');
  log(await api.get('/', { auth: 'jwt' }));
}

async function axiosWithJwt() {
  const token = 'YOUR_JWT_TOKEN';
  try {
    const response = await axios.get(`${API_BASE}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    log(response.data);
  } catch (error) {
    log(error.response ? error.response.data : String(error));
  }
}

document.getElementById('btn-api-key').addEventListener('click', getWithApiKey);
document.getElementById('btn-jwt').addEventListener('click', getWithJwt);
document.getElementById('btn-axios-jwt').addEventListener('click', axiosWithJwt);

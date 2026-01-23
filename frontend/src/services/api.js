import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Interceptor to inject Role and User ID into Headers
api.interceptors.request.use((config) => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            config.headers['x-user-role'] = user.role;
            config.headers['x-user-id'] = user._id;
        }
    } catch (e) {
        console.error("Interceptor Error", e);
    }
    return config;
});

const getUserParams = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return { userId: user._id, role: user.role };
        }
    } catch (e) {
        console.error("Error parsing user from localStorage", e);
    }
    return {};
};

// Purchase APIs
export const purchaseAPI = {
  getAll: (page = 1, limit = 10) => api.get('/purchase', { params: { page, limit } }),
  create: (data) => api.post('/purchase', data),
  update: (id, data) => api.put(`/purchase/${id}`, data),
  delete: (id) => api.delete(`/purchase/${id}`),
  addPackets: (id, numberOfPackets) => api.post(`/purchase/${id}/add-packets`, { numberOfPackets }),
};

// Packet APIs
export const packetAPI = {
  getAll: (page = 1, limit = 10) => api.get('/packet', { params: { page, limit, ...getUserParams() } }),
  create: (data) => api.post('/packet', data),
  update: (id, data) => api.put(`/packet/${id}`, data),
  delete: (id) => api.delete(`/packet/${id}`),
  getByNo: (packetNo) => api.get(`/packet/no/${packetNo}`, { params: getUserParams() }),
};

// Master Data APIs
export const masterAPI = {
  color: {
    getAll: (page = 1, limit = 10) => api.get('/master/color', { params: { page, limit } }),
    create: (data) => api.post('/master/color', data),
    update: (id, data) => api.put(`/master/color/${id}`, data),
    delete: (id) => api.delete(`/master/color/${id}`),
  },
  stone: {
    getAll: (page = 1, limit = 10) => api.get('/master/stone', { params: { page, limit } }),
    create: (data) => api.post('/master/stone', data),
    update: (id, data) => api.put(`/master/stone/${id}`, data),
    delete: (id) => api.delete(`/master/stone/${id}`),
  },
  shape: {
    getAll: (page = 1, limit = 10) => api.get('/master/shape', { params: { page, limit } }),
    create: (data) => api.post('/master/shape', data),
    update: (id, data) => api.put(`/master/shape/${id}`, data),
    delete: (id) => api.delete(`/master/shape/${id}`),
  },
  cut: {
    getAll: (page = 1, limit = 10) => api.get('/master/cut', { params: { page, limit } }),
    create: (data) => api.post('/master/cut', data),
    update: (id, data) => api.put(`/master/cut/${id}`, data),
    delete: (id) => api.delete(`/master/cut/${id}`),
  },
  purity: {
    getAll: (page = 1, limit = 10) => api.get('/master/purity', { params: { page, limit } }),
    create: (data) => api.post('/master/purity', data),
    update: (id, data) => api.put(`/master/purity/${id}`, data),
    delete: (id) => api.delete(`/master/purity/${id}`),
  },
  polish: {
    getAll: (page = 1, limit = 10) => api.get('/master/polish', { params: { page, limit } }),
    create: (data) => api.post('/master/polish', data),
    update: (id, data) => api.put(`/master/polish/${id}`, data),
    delete: (id) => api.delete(`/master/polish/${id}`),
  },
  symmetry: {
    getAll: (page = 1, limit = 10) => api.get('/master/symmetry', { params: { page, limit } }),
    create: (data) => api.post('/master/symmetry', data),
    update: (id, data) => api.put(`/master/symmetry/${id}`, data),
    delete: (id) => api.delete(`/master/symmetry/${id}`),
  },
  fluorescence: {
    getAll: (page = 1, limit = 10) => api.get('/master/fluorescence', { params: { page, limit } }),
    create: (data) => api.post('/master/fluorescence', data),
    update: (id, data) => api.put(`/master/fluorescence/${id}`, data),
    delete: (id) => api.delete(`/master/fluorescence/${id}`),
  },
  table: {
    getAll: (page = 1, limit = 10) => api.get('/master/table', { params: { page, limit } }),
    create: (data) => api.post('/master/table', data),
    update: (id, data) => api.put(`/master/table/${id}`, data),
    delete: (id) => api.delete(`/master/table/${id}`),
  },
  tension: {
    getAll: (page = 1, limit = 10) => api.get('/master/tension', { params: { page, limit } }),
    create: (data) => api.post('/master/tension', data),
    update: (id, data) => api.put(`/master/tension/${id}`, data),
    delete: (id) => api.delete(`/master/tension/${id}`),
  },
  height: {
    getAll: (page = 1, limit = 10) => api.get('/master/height', { params: { page, limit } }),
    create: (data) => api.post('/master/height', data),
    update: (id, data) => api.put(`/master/height/${id}`, data),
    delete: (id) => api.delete(`/master/height/${id}`),
  },
  length: {
    getAll: (page = 1, limit = 10) => api.get('/master/length', { params: { page, limit } }),
    create: (data) => api.post('/master/length', data),
    update: (id, data) => api.put(`/master/length/${id}`, data),
    delete: (id) => api.delete(`/master/length/${id}`),
  },
  width: {
    getAll: (page = 1, limit = 10) => api.get('/master/width', { params: { page, limit } }),
    create: (data) => api.post('/master/width', data),
    update: (id, data) => api.put(`/master/width/${id}`, data),
    delete: (id) => api.delete(`/master/width/${id}`),
  },
  manager: {
    getAll: (page = 1, limit = 10) => api.get('/master/managers', { params: { page, limit } }),
    create: (data) => api.post('/master/managers', data),
    update: (id, data) => api.put(`/master/managers/${id}`, data),
    delete: (id) => api.delete(`/master/managers/${id}`),
  },
  party: {
    getAll: (page = 1, limit = 10) => api.get('/master/parties', { params: { page, limit } }),
    create: (data) => api.post('/master/parties', data),
    update: (id, data) => api.put(`/master/parties/${id}`, data),
    delete: (id) => api.delete(`/master/parties/${id}`),
  },
  department: {
    getAll: (page = 1, limit = 10) => api.get('/master/departments', { params: { page, limit } }),
    create: (data) => api.post('/master/departments', data),
    update: (id, data) => api.put(`/master/departments/${id}`, data),
    delete: (id) => api.delete(`/master/departments/${id}`),
  },
  employee: {
    getAll: (page = 1, limit = 10) => api.get('/master/employees', { params: { page, limit } }),
    create: (data) => api.post('/master/employees', data),
    update: (id, data) => api.put(`/master/employees/${id}`, data),
    delete: (id) => api.delete(`/master/employees/${id}`),
  },
  process: {
    getAll: () => api.get('/master/process'),
    create: (data) => api.post('/master/process', data),
  },
};

export const assignAPI = {
  assignPacket: (data) => api.post('/assign/assign-packet', data),
  getHistory: (packetNo) => api.get(`/assign/assign/${packetNo}`, { params: getUserParams() }),
};

export default api;

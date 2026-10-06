import api from './api';

export const doctorService = {
  // Real Backend Endpoint: GET /doctors
  getAllDoctors: async (departmentId = null) => {
    try {
      const params = departmentId ? { departmentId } : {};
      const response = await api.get('/doctors', { params });
      return response.data || [];
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load doctors roster from database';
      throw new Error(msg);
    }
  },

  // Real Backend Endpoint: GET /doctors/{id}
  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `Failed to fetch doctor #${id}`;
      throw new Error(msg);
    }
  },

  // Real Backend Endpoint: GET /doctors/department/{deptId}
  getDoctorsByDepartment: async (deptId) => {
    try {
      const response = await api.get(`/doctors/department/${deptId}`);
      return response.data || [];
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `Failed to fetch doctors for department #${deptId}`;
      throw new Error(msg);
    }
  },

  // Real Backend Endpoint: POST /doctors
  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('/doctors', doctorData);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to register doctor in database';
      throw new Error(msg);
    }
  },

  // Real Backend Endpoint: PUT /doctors/{id}
  updateDoctor: async (id, doctorData) => {
    try {
      const response = await api.put(`/doctors/${id}`, doctorData);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `Failed to update doctor #${id}`;
      throw new Error(msg);
    }
  },
};

export default doctorService;

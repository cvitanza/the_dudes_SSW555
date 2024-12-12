import axios from 'axios';

const apiClient = axios.create();

apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Handle expired token
    if (error.response?.status === 401 && error.response?.data?.isExpired) {
      try {
        // Call the refresh token API
        const { data } = await axios.post('http://localhost:5000/api/refresh-token', {
          refreshToken: localStorage.getItem('refreshToken'),
        });

        // Store new access token
        localStorage.setItem('accessToken', data.accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh Token Error:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
import { getToken, removeToken } from '../components/authService';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('getToken should retrieve token from localStorage', () => {
    localStorage.setItem('token', 'mockToken');
    expect(getToken()).toBe('mockToken');
  });

  test('removeToken should remove token from localStorage', () => {
    localStorage.setItem('token', 'mockToken');
    removeToken();
    expect(localStorage.getItem('token')).toBeNull();
  });
});

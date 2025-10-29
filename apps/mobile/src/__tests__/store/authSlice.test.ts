import { authReducer, setCredentials, logout, setLoading } from '../../store/slices/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCredentials', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };
    const token = 'test-token';

    const actual = authReducer(initialState, setCredentials({ user, token }));
    
    expect(actual.user).toEqual(user);
    expect(actual.token).toEqual(token);
    expect(actual.isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    const loggedInState = {
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'test-token',
      isAuthenticated: true,
      isLoading: false,
    };

    const actual = authReducer(loggedInState, logout());
    
    expect(actual.user).toBeNull();
    expect(actual.token).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });

  it('should handle setLoading', () => {
    const actual = authReducer(initialState, setLoading(true));
    
    expect(actual.isLoading).toBe(true);
  });
});


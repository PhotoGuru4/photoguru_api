export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Registration successful',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REFRESH_SUCCESS: 'Tokens refreshed successfully',
    EMAIL_EXISTS: 'Email is already registered',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCESS_DENIED: 'Access Denied',
    TOKEN_MALFORMED: 'Refresh token malformed',
  },
  USER: {
    NOT_FOUND: 'User not found',
    UPDATE_SUCCESS: 'Profile updated successfully',
    FETCH_PROFILE_SUCCESS: 'User profile fetched successfully',
  },
  CONCEPT: {
    FETCH_RECOMMENDED_SUCCESS: 'Recommended concepts fetched successfully',
    FETCH_SUCCESS: 'Concepts fetched successfully',
    NOT_FOUND: 'Concept not found',
    INVALID_PAGINATION_CURSOR: 'Invalid pagination cursor',
  },
} as const;

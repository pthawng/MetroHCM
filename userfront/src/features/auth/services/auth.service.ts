import { User } from '../store/auth.store';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Seconds
}

class AuthService {
  private mockUser: User = {
    id: 'usr_metro_001',
    email: 'architect@metrohcm.com',
    fullName: 'Senior Architect',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150'
  };

  /**
   * Simulate Sign-In (JWT mock)
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

    // Demo check
    if (email === 'architect@metrohcm.com' && password === 'admin123') {
      return {
        user: this.mockUser,
        accessToken: 'mock_access_token_' + Math.random().toString(36).substring(7),
        refreshToken: 'mock_refresh_token_' + Math.random().toString(36).substring(7),
        expiresIn: 3600 // 1 hour
      };
    }

    throw new Error('AUTH_INVALID_CREDENTIALS');
  }

  /**
   * Simulate Sign-Up (JWT mock)
   */
  async signUp(fullName: string, email: string, password: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate existing email
    if (email === 'architect@metrohcm.com') {
      throw new Error('AUTH_EMAIL_EXISTS');
    }

    return {
      user: {
        id: 'usr_' + Math.random().toString(36).substring(7),
        email,
        fullName,
        role: 'USER'
      },
      accessToken: 'mock_access_token_' + Math.random().toString(36).substring(7),
      refreshToken: 'mock_refresh_token_' + Math.random().toString(36).substring(7),
      expiresIn: 3600
    };
  }

  /**
   * Simulate Refresh Token logic
   */
  async refreshToken(token: string): Promise<Pick<AuthResponse, 'accessToken' | 'expiresIn'>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      accessToken: 'refreshed_access_token_' + Math.random().toString(36).substring(7),
      expiresIn: 3600
    };
  }

  /**
   * Mock Logout
   */
  async signOut(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

export const authService = new AuthService();

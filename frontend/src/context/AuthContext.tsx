import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  Children,
} from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

interface responseData {
  username: string;
  accessToken: string;
}

interface AuthContextType {
  user: string | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const { data } = await axios.post<responseData>('/api/v1/auth/login', {
      email,
      password,
    });
    setUser(data.username);
    setAccessToken(data.accessToken);
  };
  const logout = async () => {
    try {
      await axios.post('/api/v1/auth/logout');
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.log(error);
    }
  };
  const register = async (name: string, email: string, password: string) => {
    const { data } = await axios.post<responseData>('/api/v1/auth/register', {
      name,
      email,
      password,
    });
    setUser(data.username);
    setAccessToken(data.accessToken);
  };

  useEffect(() => {
    const fetchNewToken = async () => {
      try {
        const { data } = await axios.get<responseData>(
          '/api/v1/auth/refresh-token'
        );
        setUser(data.username);
        setAccessToken(data.accessToken);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };

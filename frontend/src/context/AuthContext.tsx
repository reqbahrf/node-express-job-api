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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const { data } = await axios.post<responseData>('/api/v1/auth/login', {
      email,
      password,
    });
    setUser(data.username);
    setAccessToken(data.accessToken);
  };
  const logout = async () => {
    await axios.post('/api/v1/auth/logout');
    setUser(null);
    setAccessToken(null);
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
    axios
      .get('/api/v1/auth/refresh-token')
      .then(({ data }) => {
        setUser(data.username);
        setAccessToken(data.accessToken);
      })
      .catch(() => {
        setUser(null);
        setAccessToken(null);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, register }}
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

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
// សូមប្រាកដថា User type របស់អ្នកមានពិតប្រាកដនៅក្នុង path នេះ
import { User } from '../../types'; 

// កែតាម Link API របស់អ្នក
const API_URL = 'http://localhost:5000/api'; 
// ឬ 'https://my-skills-api.onrender.com/api'

axios.defaults.baseURL = API_URL;

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  
  // ✅ ចំណុចសំខាន់៖ បន្ថែម function នេះដើម្បី Update State ពីខាងក្រៅបាន
  setAuth: (token: string, user: User) => void;
  
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // ពេលបើក Web ភ្លាម Check Token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      // បើ Token ខូច ឬផុតកំណត់ Clear ចោល
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  // ✅ Function ពិសេសសម្រាប់ RegisterPage ហៅប្រើ
  // ដើម្បីដាក់ User ចូល State ភ្លាមៗដោយមិនបាច់ Call API ម្ដងទៀត
  const setAuth = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    // localStorage.setItem('user', JSON.stringify(newUser)); // Optional: ទុកក៏បាន អត់ក៏បាន
    
    setToken(newToken);
    setUser(newUser);
    
    // Set Header សម្រាប់ Request ក្រោយៗ
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  // Login ធម្មតា
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        // ហៅ setAuth ដើម្បី Update State
        setAuth(token, user);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'ការចូលបរាជ័យ';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register ធម្មតា (បើមិនប្រើ RegisterPage ផ្ទាល់ខ្លួន)
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/auth/register', { name, email, password });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        setAuth(token, user);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'ការចុះឈ្មោះបរាជ័យ';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      refreshUser, 
      login,
      register,
      setAuth, // Export function នេះ
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
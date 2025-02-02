import api from "@/services/api";
import { getAuthTokens, removeAuthTokens } from "@/services/auth";
import { ENDPOINTS } from "@/services/config";
import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
  profile: {
    avatar: string;
  };
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { access } = await getAuthTokens();
      if (!access) {
        setUser(null);
        return;
      }

      const response = await api.get(ENDPOINTS.USER_PROFILE);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      await removeAuthTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Runs only on mount

  const refetch = async () => {
    await fetchUser();
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged: !!user,
        user,
        loading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;

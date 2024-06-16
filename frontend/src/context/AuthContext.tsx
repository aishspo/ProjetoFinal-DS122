import { AxiosResponse } from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../services/api";

// Define a interface para o contexto
interface AuthContextData {
  user: Iuser | null;
  student: IStudent | null;
  teacher: ITeacher | null;
  reload: boolean;
  signIn: ({
    email,
    password,
  }: SignInProps) => Promise<{ error?: string } | void>;
  updateUser: () => Promise<void>;
  signOut: () => void;
  signed: boolean;
}

// Define a interface para os props do SignIn
interface SignInProps {
  email: string;
  password: string;
}

// Define a interface para o AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Cria o contexto com o valor inicial
export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Iuser | null>(null);
  const [student, setStudent] = useState<IStudent | null>(null);
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    const loadStoredData = async () => {
      const storageToken = localStorage.getItem("@Auth:token");

      if (storageToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storageToken}`;

        try {
          const responseMiddlewares: AxiosResponse<IProfile> = await api.get(
            "/profile"
          );
          if (responseMiddlewares.data.error) {
            localStorage.clear();
            setUser(null);
            setStudent(null);
            setTeacher(null);
            alert(responseMiddlewares.data.error);
          } else {
            setUser(responseMiddlewares.data.user);
            setStudent(responseMiddlewares.data.student || null);
            setTeacher(responseMiddlewares.data.teacher || null);
          }
        } catch (error) {
          localStorage.clear();
          setUser(null);
          setStudent(null);
          setTeacher(null);
          console.error(error);
        }
      }

      await new Promise((res) => setTimeout(res, 300));
    };

    loadStoredData()
      .then(() => {
        setReload(true);
      })
      .catch((error) => alert(error));
  }, []);

  const signIn = async ({ email, password }: SignInProps): Promise<{ error?: string } | void> => {
    try {
        const response: AxiosResponse<ResponseSingIn> = await api.post("/login", { email, password });
        console.log(response.data);

        if (response.data.error) {
            // Verificação específica para erros relacionados ao usuário não encontrado ou senha incorreta
            if (response.data.error === "User not found") {
                return { error: "Usuário não encontrado. Verifique suas credenciais e tente novamente." };
            } else if (response.data.error === "Incorrect password") {
                return { error: "Senha incorreta. Tente novamente." };
            } else {
                return { error: response.data.error };
            }
        } else {
            api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
            localStorage.setItem("@Auth:token", response.data.token);

            const responseMiddlewares: AxiosResponse<IProfile> = await api.get("/profile");
            if (responseMiddlewares.data.error) {
                return { error: responseMiddlewares.data.error };
            } else {
                setUser(responseMiddlewares.data.user);
                setStudent(responseMiddlewares.data.student || null);
                setTeacher(responseMiddlewares.data.teacher || null);
            }
        }
    } catch (error: any) {
        console.error(error);

        // Verifica se o erro possui uma resposta da API
        if (error.response && error.response.data) {
            if (error.response.status === 400) {
                return { error: "Usuário não encontrado ou senha incorreta." };
            }
            return { error: error.response.data.message || "Ocorreu um erro durante o login. Por favor, tente novamente mais tarde." };
        } else {
            // Trata erros sem resposta da API (ex: problemas de rede)
            return { error: "Ocorreu um erro durante o login. Por favor, tente novamente mais tarde." };
        }
    }
};

  const signOut = () => {
    localStorage.clear();
    setUser(null);
    setStudent(null);
    setTeacher(null);
    return <Navigate to="/" />;
  };

  const updateUser = async () => {
    try {
      const responseMiddlewares: AxiosResponse<IProfile> = await api.get(
        "/profile"
      );
      if (responseMiddlewares.data.error) {
        alert(responseMiddlewares.data.error);
      } else {
        setUser(responseMiddlewares.data.user);
        setStudent(responseMiddlewares.data.student || null);
        setTeacher(responseMiddlewares.data.teacher || null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        teacher,
        reload: reload,
        signIn,
        signOut,
        updateUser,
        signed: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

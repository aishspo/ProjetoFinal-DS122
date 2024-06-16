import { api } from "../api"

export const GetUsers = async () => {
    try {
      const response = await api.get('/user/student');
      console.log(response.data);
      return response.data; // Retorna apenas os dados, não a resposta completa
  
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
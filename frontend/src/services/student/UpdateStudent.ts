import { api } from "../api";

type Idata = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export const updateUser = async (data: Idata) => {
  try {
    const response = await api.put("/user/student/:id", data);
    console.log(response.data);
    return response;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateStudent = async (data: Idata) => {
    try {
      const response = await api.put(`/user/student/:id`, data);
      console.log(response.data);
      return response;
  
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
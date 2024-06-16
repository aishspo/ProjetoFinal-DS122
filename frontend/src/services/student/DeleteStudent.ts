import { api } from "../api";

export const deleteStudent = async (studentId: number) => {
  try {
    const response = await api.delete(`/user/student/${studentId}`);
    console.log(response.data);
    return response;
  } catch (error) {
    console.error('Erro ao excluir estudante:', error);
    throw error;
  }
};

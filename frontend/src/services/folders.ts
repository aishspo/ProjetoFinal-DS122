import { api } from './api';

export const getAllFolders = async () => {
  try {
    const response = await api.get('/students/allFolders');
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter pastas: ${error}`);
  }
};

export const getFolders = async () => {
  const response = await api.get("students/folder");
  return response.data;
};

export const addFolder = async (data: { name: string, parentId: number | null }) => {
  return api.post(`/students/folder`, data);
};

export const deleteFolder = async (id: number) => {
  return api.delete(`/students/folder/${id}`);
};
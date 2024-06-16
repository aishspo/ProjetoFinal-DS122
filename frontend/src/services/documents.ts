import { AxiosResponse } from "axios";
import { api } from "../services/api";
import { ICreateDocument } from "@/interface/IGetDocuments";
import { IDocument } from "@/interface/IDocument";

type ICreate = {
  name: string;
  folderId: number | null | "";
  file: File;
};

export const CreateDocument = async ({ name, folderId, file }: ICreate) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("folderId", folderId?.toString() || "");
    formData.append("file", file);

    const response: AxiosResponse<ICreateDocument> = await api.post(
      "/students/documents",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetDocument = async ({ id }: { id: number | null }) => {
  try {
    const response = await api.get("/students/documents", {
      params: { id },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMoacir = async (): Promise<IDocument[]> => {
  try {
    const response: AxiosResponse<IDocument[]> = await api.get("/documents");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    throw new Error("Erro ao buscar documentos.");
  }
};

export const DownloadDocument = async (documentId: number): Promise<Blob> => {
  try {
    const response: AxiosResponse<Blob> = await api.get(
      `/students/documents/${documentId}/download`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllDocuments = async (folderId: number) => {
  try {
    const response = await api.get(`/students/allDocuments?id=${folderId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter documentos da pasta ${folderId}: ${error}`);
  }
};

export const deleteDocument = async (documentId: number) => {
  return api.delete(`/students/documents/${documentId}`);
};

export const addDocument = async (
  folderId: number,
  file: File,
  documentName: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId.toString());
    formData.append("name", documentName);

    const response = await api.post("/students/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Erro ao adicionar documento: ${error}`);
  }
};

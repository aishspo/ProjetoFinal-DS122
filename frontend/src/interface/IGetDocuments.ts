import { IPaths } from "./IGetFolders";

// Representa a resposta ao obter documentos
export type IResponseDocument = {
  id: number;
  name: string;
  error?: string;
}[];

// Representa a criação de um documento
export type ICreateDocument = {
  id: number;
  name: string;
  folder: number | null | string;
  students: {
    id: number;
    name: string;
  }[];
  error?: string;
};

// Propriedades esperadas pelo componente CreateFolderDocuments
export interface IProps {
    text: "Pasta" | "Documento";
    textType: string;
    path: IPaths | null;
    id: number | null;
    onCreate: () => Promise<void>;
  }
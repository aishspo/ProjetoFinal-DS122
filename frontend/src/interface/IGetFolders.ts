// Representa os filhos de uma pasta
export type IChildren = {
    id: number;
    name: string;
  };
  
  // Representa a resposta ao obter pastas
  export type IResponse = {
    id: string | number;
    name: string;
    parentFolder: number | null;
    children?: IChildren[];
    error?: string;
  };
  
  // Representa o caminho atual no sistema de pastas
  export type IPaths = {
    id: number;
    name: string;
  }[];
  
  // Representa a criação de uma pasta
  export type ICreateFolder = {
    id: number;
    name: string;
    students: {
      id: number;
      name: string;
    }[];
    error?: string;
  };
import React, { useEffect, useState, Fragment } from "react";

import { getAllFolders, addFolder, deleteFolder } from "@/services/folders";
import { deleteDocument, getAllDocuments } from "@/services/document/apiDocument";
import { api } from "@/services/api";

import { CreateFolder } from "../CreateFolder"; // Componente de criação de pasta
import { IDocument } from "@/interface/IDocument";
import { Button } from "./button";
import { Input } from "./input";
import Loading from "../Loading";

interface Folder {
  id: number;
  name: string;
  filePath: string;
  user?: {
    email: string;
  };
  documents: IDocument[];
}

const AllFolders: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [currentFolderDocuments, setCurrentFolderDocuments] = useState<IDocument[]>([]);
  const [documentName, setDocumentName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const foldersData = await getAllFolders();
      setFolders(foldersData);
    } catch (error: any) {
      console.error("Erro ao obter pastas:", error.message);
      setError("Erro ao obter pastas.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async (folderId: number) => {
    if (currentFolderId === folderId) {
      setCurrentFolderId(null);
      setCurrentFolderDocuments([]);
    } else {
      try {
        const documentsData = await getAllDocuments(folderId);
        setCurrentFolderDocuments(documentsData);
        setCurrentFolderId(folderId);
      } catch (error: any) {
        console.error(`Erro ao obter documentos da pasta ${folderId}:`, error.message);
        setError(`Erro ao obter documentos da pasta ${folderId}.`);
      }
    }
  };

  const handleAddDocument = async (folderId: number) => {
    if (!file) {
      setFileUploadError("Por favor, selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", documentName);
    formData.append("folderId", folderId.toString());

    try {
      const response = await api.post("/students/documents", formData);
      console.log("Documento adicionado com sucesso:", response);
      await fetchDocuments(folderId);
      setFileUploadError(null);
    } catch (error: any) {
      console.error("Erro ao adicionar documento:", error.message);
      setFileUploadError("Erro ao adicionar documento.");
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    try {
      setError(null);
      await deleteDocument(documentId);

      if (currentFolderId !== null) {
        await fetchDocuments(currentFolderId);
      }
    } catch (error: any) {
      console.error(`Erro ao deletar documento ${documentId}:`, error.message);
      setError(`Erro ao deletar documento: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddFolder = async (name: string) => {
    try {
      await addFolder({ name, parentId: currentFolderId });
      await fetchData();
    } catch (error: any) {
      console.error("Erro ao adicionar pasta:", error.message);
      setError("Erro ao adicionar pasta.");
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await deleteFolder(folderId);
      await fetchData();
    } catch (error: any) {
      console.error(`Erro ao deletar pasta ${folderId}:`, error.message);
      setError(`Erro ao deletar pasta.`);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h1 className="font-semibold pb-4 text-2xl">Pastas de Todos os Usuários</h1>
      <div className="mb-4">
        <CreateFolder onCreate={handleAddFolder} />
      </div>
      <ul className="space-y-4">
        {folders.map((folder) => (
          <li key={folder.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-lg">{folder.name}</span>
                {folder.user && <span className="block text-sm text-gray-500">Usuário: {folder.user.email}</span>}
              </div>
              <div>
                <Button variant="outline" onClick={() => fetchDocuments(folder.id)}>
                  {currentFolderId === folder.id ? "Fechar documentos" : "Visualizar documentos"}
                </Button>
                <Button variant="delete" onClick={() => handleDeleteFolder(folder.id)} className="ml-2">
                  Excluir Pasta
                </Button>
              </div>
            </div>

            {currentFolderId === folder.id && (
              <ul className="mt-4 space-y-2">
                {currentFolderDocuments.length === 0 ? (
                  <li className="text-gray-500">Sem documentos</li>
                ) : (
                  currentFolderDocuments.map((doc) => (
                    <Fragment key={doc.id}>
                      <li className="flex justify-between items-center p-2 border rounded-lg">
                        {doc.name}
                        <div className="flex space-x-2">
                          <Button variant="outline" size={"icon"}>
                            <a href={doc.filePath} download>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                            </a>
                          </Button>
                          <Button variant="delete" onClick={() => handleDeleteDocument(doc.id)}>
                            Excluir
                          </Button>
                        </div>
                      </li>
                    </Fragment>
                  ))
                )}

                <h3 className="font-semibold pt-4 text-base my-5">Inserir documento</h3>
                <li className="mt-4 flex flex-col space-y-2">
                  <Input type="text" placeholder="Nome do Documento" value={documentName} onChange={(e) => setDocumentName(e.target.value)} />
                  <div className="flex flex-row space-x-3">
                    <Input type="file" onChange={(e) => {
                      setFile(e.target.files ? e.target.files[0] : null);
                      setFileUploadError(null);
                    }} />
                    <Button variant="upload" className="max-w-96" onClick={() => handleAddDocument(folder.id)}>
                      Adicionar
                    </Button>
                  </div>
                  {fileUploadError && <div className="text-red-600">{fileUploadError}</div>}
                </li>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllFolders;

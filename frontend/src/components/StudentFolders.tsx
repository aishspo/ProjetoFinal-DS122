import { useEffect, useState, Fragment } from "react";
import Loading from "./Loading"; // Componente de carregamento, se necessário
import { getAllFolders, addFolder, deleteFolder } from "@/services/folders";
import { deleteDocument, getAllDocuments } from "@/services/documents";
import { api } from "@/services/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CreateFolder } from "./CreateFolder"; // Componente de criação de pasta, se existir
import { IDocument } from "@/interface/IDocument";
import { DownloadIcon } from "@/assets/DownloadIcon";

interface Folder {
  id: number;
  name: string;
  documents: Document[];
}

export const StudentFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [currentFolderDocuments, setCurrentFolderDocuments] = useState<
    IDocument[]
  >([]);
  const [documentName, setDocumentName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchFoldersError, setFetchFoldersError] = useState<string | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [folderName] = useState<string>(""); // Novo estado para o nome da pasta
  const [folderError, setFolderError] = useState<string | null>(null);
  const [deleteDocumentError, setDeleteDocumentError] = useState<string | null>(
    null
  );

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
      setFetchFoldersError("Erro ao obter pastas.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async (folderId: number) => {
    if (currentFolderId === folderId) {
      // Se a pasta já estiver aberta, fechá-la
      setCurrentFolderId(null);
      setCurrentFolderDocuments([]);
    } else {
      // Caso contrário, abrir a pasta e buscar os documentos
      try {
        const documentsData = await getAllDocuments(folderId);
        setCurrentFolderDocuments(documentsData);
        setCurrentFolderId(folderId);
      } catch (error: any) {
        console.error(
          `Erro ao obter documentos da pasta ${folderId}:`,
          error.message
        );
        setFetchFoldersError(`Erro ao obter documentos da pasta ${folderId}.`);
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
    formData.append("folderName", folderName); // Adiciona o nome da pasta ao formData

    try {
      const response = await api.post("/students/documents", formData);
      console.log("Documento adicionado com sucesso:", response);

      // Atualizar a lista de documentos diretamente
      const updatedDocuments = await getAllDocuments(folderId);
      setCurrentFolderDocuments(updatedDocuments);
      setFileUploadError(null); // Limpar mensagem de erro em caso de sucesso
      setDocumentName(""); // Limpar o nome do documento após adicionar
      setFile(null); // Limpar o arquivo após adicionar
    } catch (error: any) {
      console.error("Erro ao adicionar documento:", error.message);
      setFileUploadError("Erro ao adicionar documento.");
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    try {
      setDeleteDocumentError(null); // Limpar o erro antes de tentar deletar o documento
      await deleteDocument(documentId);

      if (currentFolderId !== null) {
        await fetchDocuments(currentFolderId);
      }
    } catch (error: any) {
      console.error(`Erro ao deletar documento ${documentId}:`, error.message);
      setDeleteDocumentError(
        `Erro ao deletar documento: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleAddFolder = async (name: string) => {
    try {
      // Supondo que addFolder aceita um objeto com name e parentId
      await addFolder({ name, parentId: currentFolderId });
      await fetchData(); // Atualizar a lista de pastas após a criação
      setFolderError(null); // Limpar mensagem de erro em caso de sucesso
    } catch (error: any) {
      console.error("Erro ao adicionar pasta:", error.message);
      setFolderError("Erro ao adicionar pasta.");
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await deleteFolder(folderId);
      await fetchData();
    } catch (error: any) {
      console.error(`Erro ao deletar pasta ${folderId}:`, error.message);
      setFetchFoldersError(`Erro ao deletar pasta.`);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="px-6 pt-4 mx-auto max-w-4xl">
      <h1>Pastas</h1>

      {fetchFoldersError && (
        <div className="text-red-600 mb-4">{fetchFoldersError}</div>
      )}

      <div className="mb-4">
        <CreateFolder onCreate={handleAddFolder} error={folderError} />
      </div>
      <ul className="space-y-4">
        {folders.map((folder) => (
          <li key={folder.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-lg">{folder.name}</span>
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => fetchDocuments(folder.id)}
                >
                  {currentFolderId === folder.id
                    ? "Fechar documentos"
                    : "Visualizar documentos"}
                </Button>
                <Button
                  variant="delete"
                  onClick={() => handleDeleteFolder(folder.id)}
                  className="ml-2"
                >
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
                              <DownloadIcon />
                            </a>
                          </Button>

                          <Button
                            variant="delete"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </li>
                    </Fragment>
                  ))
                )}

                {deleteDocumentError && (
                  <div className="text-red-600">{deleteDocumentError}</div>
                )}

                <h3 className="font-semibold pt-4 text-base my-5">
                  Inserir documento
                </h3>

                <li className="mt-4 flex flex-col space-y-2">
                  <div className="flex flex-row space-x-3">
                    <Input
                      type="file"
                      onChange={(e) => {
                        setFile(e.target.files ? e.target.files[0] : null);
                        setFileUploadError(null); // Limpar erro ao selecionar um novo arquivo
                      }}
                    />

                    <Button
                      variant="upload"
                      className="max-w-96"
                      onClick={() => handleAddDocument(folder.id)}
                    >
                      Adicionar
                    </Button>
                  </div>
                  {fileUploadError && (
                    <div className="text-red-600">{fileUploadError}</div>
                  )}
                </li>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

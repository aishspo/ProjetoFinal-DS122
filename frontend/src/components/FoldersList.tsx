import { useEffect, useState } from "react";
import { getFolders } from "@/services/folders"; // Função para buscar pastas
import { Folder } from "@/interface/IFolder"; // Interface para pasta
import { Button } from "./ui/button";

// Define a interface para as propriedades do componente
interface Props {
  onFolderDelete: () => void;
}

export const FoldersList: React.FC<Props> = ({ onFolderDelete }) => {
  // Define o estado para armazenar as pastas, o status de carregamento e possíveis erros
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar as pastas da API
  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const fetchedFolders = await getFolders();
      setFolders(fetchedFolders);
    } catch (error) {
      console.error("Erro ao obter pastas:", error);
      setError("Erro ao obter pastas.");
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para buscar as pastas ao montar o componente ou quando `onFolderDelete` mudar
  useEffect(() => {
    fetchFolders();
  }, [onFolderDelete]);

  // Renderiza uma mensagem de carregamento enquanto as pastas estão sendo buscadas
  if (isLoading) {
    return <p>Carregando pastas...</p>;
  }

  // Renderiza uma mensagem de erro se houver um erro ao buscar as pastas
  if (error) {
    return <p>{error}</p>;
  }

  // Renderiza a lista de pastas
  return (
    <div>
      <h1 className="font-semibold pb-4 text-2xl">Lista de Pastas</h1>
      <ul className="space-y-4">
        {folders.map((folder) => (
          <li
            className="flex justify-between items-center p-2 border rounded-lg"
            key={folder.id}
          >
            <div className="flex flex-col justify-start">
              <span>{folder.name}</span>
              {/* Exibir outras informações da pasta, se houver */}
            </div>

            {/* Botões para ações na pasta, como download, exclusão, etc. */}
            <Button variant="outline" size={"icon"}>
              <a href={folder.filePath} download>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </a>
            </Button>

            {/* Exemplo de como exibir informações adicionais */}
            {/* <div>
              <h1>Outras informações</h1>
              <span>Id: {folder.id}</span>
              <span>Caminho: {folder.filePath}</span>
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

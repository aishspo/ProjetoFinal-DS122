import { useEffect, useState } from "react";
import { getMoacir } from "@/services/documents";
import { IDocument } from "@/interface/IDocument";
import { Button } from "./ui/button";

// Define a interface para as propriedades do componente
interface Props {
  onDocumentDelete: () => void;
}

export const DocumentsList: React.FC<Props> = ({ onDocumentDelete }) => {
  // Define o estado para armazenar os documentos, o status de carregamento e possíveis erros
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os documentos da API
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const fetchedDocuments = await getMoacir();
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error("Erro ao obter documentos:", error);
      setError("Erro ao obter documentos.");
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para buscar os documentos ao montar o componente ou quando `onDocumentDelete` mudar
  useEffect(() => {
    fetchDocuments();
  }, [onDocumentDelete]);

  // Renderiza uma mensagem de carregamento enquanto os documentos estão sendo buscados
  if (isLoading) {
    return <p>Carregando documentos...</p>;
  }

  // Renderiza uma mensagem de erro se houver um erro ao buscar os documentos
  if (error) {
    return <p>{error}</p>;
  }

  // Renderiza a lista de documentos
  return (
    <div className="mx-auto w-full max-w-4xl pb-10 px-6">
      <h1 className="font-semibold p-0 text-2xl">Lista de documentos</h1>
      <p className="pb-4 text-gray-500 dark:text-gray-300">Documentos de todos os alunos</p>
      <ul className="space-y-4">
        {documents.map((document) => (
          <li
            className="flex justify-between items-center p-4 border rounded-lg"
            key={document.id}
          >
            <div className="flex flex-col justify-start">
              <span>{document.name}</span>
              <span>{document.student.name}</span>
            </div>

            <Button variant="outline" size={"icon"}>
              <a href={document.filePath} download={document.name}>
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

          </li>
        ))}
      </ul>
    </div>
  );
};

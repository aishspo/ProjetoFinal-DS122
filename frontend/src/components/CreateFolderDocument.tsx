import React, { useState } from "react";
import { toast } from "sonner";
import { CreateFolder } from "@/services/student/getFolders";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { IProps } from "../interface/IGetDocuments"; // Importa as interfaces do arquivo types
import { Button } from "./ui/button";

// Define as propriedades esperadas pelo componente
export const CreateFolderDocuments: React.FC<IProps> = ({
  text,
  textType,
  path,
  id,
  onCreate,
}) => {
  // Estado para armazenar o nome e o arquivo selecionado
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Função para criar uma pasta ou documento
  const handleCreateFolder = async () => {
    try {
      if (text === "Pasta") {
        // Cria uma pasta
        const response = await CreateFolder({ name, id });
        handleResponse(response, "Pasta");
      } else if (text === "Documento") {
        if (!file) {
          toast.warning("Selecione um arquivo.");
          return;
        }
      }
    } catch (error: any) {
      console.error("Erro ao criar", text.toLowerCase(), ":", error);
      toast.warning(`Erro ao criar ${text.toLowerCase()}: ${error.message}`);
    }
  };

  // Função para lidar com a resposta da criação de pasta ou documento
  const handleResponse = (response: any, type: string) => {
    if (response?.data.error) {
      toast.error(response.data.error as string, {
        className: "bg-red",
      });
    } else {
      toast.success(`${type} criado com sucesso`, {
        description: `Nome: ${response.data.name}`,
      });
      onCreate(); // Atualiza a página
      setName(""); // Limpa o campo de entrada
    }
  };

  return (
    <Dialog>
      <DialogTrigger>+{text}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Criar {textType} dentro de{" "}
            {path && `'${path[path.length - 1].name}'?`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          {text === "Documento" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                Arquivo
              </Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="col-span-3"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleCreateFolder}>Criar {text}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

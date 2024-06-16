import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CreateFolderProps {
  onCreate: (name: string) => void;
  error: string | null;
}

export const CreateFolder: React.FC<CreateFolderProps> = ({
  onCreate,
  error,
}) => {
  const [folderName, setFolderName] = useState<string>("");

  const handleCreateFolder = () => {
    onCreate(folderName);
    setFolderName("");
  };

  return (
    <div>
      <div className="flex flex-row space-x-2">
        <Input
          type="text"
          placeholder="Nome da Pasta"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <Button variant="outline" onClick={handleCreateFolder}>
          Criar Pasta
        </Button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

import { useState, useEffect, Fragment } from "react";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { FolderIcons } from "@/assets/FolderIcons";
import { CreateFolder } from "./CreateFolder";
import { getAllFolders, addFolder, deleteFolder } from "@/services/folders";
import Loading from "./Loading";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface IFolder {
  id: number;
  name: string;
  children?: IFolder[];
}

interface IPath {
  id: number;
  name: string;
}

export const Folder = () => {
  const [idFolder, setIdFolder] = useState<{ id: number | null }>({ id: 0 });
  const [path, setPath] = useState<IPath[] | null>(null);
  const [childrenFolder, setChildrenFolder] = useState<IFolder[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllFolders();
        setChildrenFolder(response.data.children || null);
        setPath(response.data.path || null);
      } catch (err) {
        handleFetchError("Erro ao carregar as pastas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idFolder]);

  const handleFetchError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleAddFolder = async (name: string) => {
    try {
      await addFolder({ name, parentId: idFolder.id });
      await fetchData();
    } catch (err) {
      handleFetchError("Erro ao adicionar a pasta");
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await deleteFolder(folderId);
      await fetchData();
    } catch (err) {
      handleFetchError("Erro ao deletar a pasta");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    toast.error(error as string, {
      className: "bg-red",
    });
  }

  return (
    <div className="mt-0 m-10">
      <div className="flex justify-between mb-3 align-middle">
        <div className="space-x-5">
          <CreateFolder
            onCreate={handleAddFolder}
          />
        </div>
      </div>
    </div>
  );
};

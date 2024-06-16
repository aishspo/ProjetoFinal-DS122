import { deleteStudent } from "@/services/student/DeleteStudent";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/interface/IUser";
import { GetUsers } from "@/services/users/GetUsers";

export const StudentsList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await GetUsers();
        console.log("Dados recebidos da API:", data);
        setUsers(data);
      } catch (error) {
        console.error("Erro ao obter usuários:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdate = (userId: number) => {
    navigate(`/teacher/update/${userId}`);
  };

  const handleDelete = async (studentId: number) => {
    try {
      await deleteStudent(studentId);
      setUsers(users.filter((user) => user.id !== studentId));
    } catch (error) {
      console.error("Erro ao excluir estudante:", error);
      // Exibir mensagem de erro para o usuário, se necessário
    }
  };
  return (
    <div className="mx-auto w-full max-w-xl pb-8">
      <h1 className="font-semibold p-0 text-2xl">Lista de Estudantes</h1>
      <p className="pb-4 text-gray-500 dark:text-gray-300">Todos os estudantes cadastrados</p>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex flex-col justify-between sm:items-center sm:flex-row">
              <div className="flex flex-col justify-start">
                <span className="block text-lg">{user.name}</span>
                <span className="block">{user.user?.email}</span>
              </div>
              <div className="pt-2 sm:pt-0">
                <Button variant={"secondary"} onClick={() => handleUpdate(user.id)}>Editar</Button>
                <Button variant={"delete"} className="ml-2" onClick={() => handleDelete(user.id)}>
                  Excluir
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

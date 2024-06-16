import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const UpdateStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/user/student/${id}`);
        const userData = response.data.student;
        setUser({
          name: userData.name || "",
          email: userData.email || "",
          password: "",
        });
      } catch (error) {
        setMessage("Erro ao buscar dados do usuário.");
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await api.put(`/user/student/${id}`, user);
      navigate("/teacher/home");
    } catch (error) {
      setMessage("Erro ao atualizar usuário.");
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="container max-w-lg">
        <h1>Editar Usuário</h1>
        {message && <p>{message}</p>}
        <form
          className="flex flex-col justify-between items-center p-4 border rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col pb-4  w-4/5">
            <label className="font-semibold">Nome</label>
            <Input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col pb-4 w-4/5">
            <label className="font-semibold pb-1">Email</label>
            <Input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col pb-4  w-4/5">
            <label className="font-semibold">Senha</label>
            <Input
              type="password"
              name="password"
              placeholder="Redefina a senha"
              value={user.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Button className="mt-2" variant={"upload"} type="submit">
              Salvar
            </Button>
            <Button className="ml-2" variant={"outline"} type="submit">
              Voltar
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

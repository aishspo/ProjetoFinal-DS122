import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { UpdateUser } from "./UpdateUser";
import { Typography } from "@mui/material";
import { Logo } from "@/assets/Logo";


export const Header = () => {
    const { student, teacher, signOut } = useContext(AuthContext);
    return (
        <nav className="flex justify-between p-10 mb-8">
            <Typography variant="h6" >Olá, {student ? student.name : teacher ? teacher.name : "Desconhecido"}</Typography>
            <Logo />

            <div className="flex">
                <ModeToggle />
                <div className="mx-3" >
                    <UpdateUser />
                </div>
                <Button onClick={signOut}>Sair</Button>
            </div>
        </nav>
    )
}
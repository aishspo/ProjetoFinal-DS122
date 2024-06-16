import { RouterProvider, createBrowserRouter } from "react-router-dom"; // react router dom
import { PrivateStudent, PrivateTeacher } from "./privateRoutes"; // PivateRouter

// pages
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { DashBoardStudent } from "./pages/Student/DashBoardStudent";
import { DashBoardTeacher } from "./pages/Teacher/DashBoardTeacher";
import { UpdateUser } from "./components/UpdateUser";
import { UpdateStudent } from "./pages/Teacher/UpdateStudent";
import { CreateFolderDocuments } from "./components/CreateFolderDocument";

const Routes: React.FC = () => {
  const routesForPublic = [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },

    // Rotas para Alunos / Students
    {
      path: "/student",
      element: <PrivateStudent />,
      children: [
        {
          path: "home",
          element: <DashBoardStudent />,
        },
      ],
    },

    // Rotas para Professores / Teachers
    {
      path: "/teacher",
      element: <PrivateTeacher />,
      children: [
        {
          path: "home",
          element: <DashBoardTeacher />,
        },
        {
          path: "update",
          element: <UpdateUser />,
        },
        {
          path: "update/:id",
          element: <UpdateStudent />,
        },
        // Rotas para documentos
        {
          path: "documents/create",
          element: <CreateFolderDocuments />,
        },
        {
          path: "documents/create/:folderId",
          element: <CreateFolderDocuments />,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routesForPublic);

  return <RouterProvider router={router} />;
};

export default Routes;

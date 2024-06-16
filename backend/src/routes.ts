// src/routes.ts
import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { FolderController } from "./controllers/FolderController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { DocumentsController } from "./controllers/documentsController";
import { StudentController } from "./controllers/StudentController";
import multer from "multer";

const routes = Router();
import { uploadSingleFile } from './middlewares/handleMulterErrors'

// Configuração do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
export const upload = multer({ storage });

// Rotas públicas
routes.post("/user", new UserController().create);
routes.post("/login", new UserController().login);

// Middleware de autenticação
routes.use(authMiddleware);

// Rotas protegidas
routes.get("/profile", new UserController().getProfile);

// Rotas de Documentos
routes.post('/students/documents', uploadSingleFile, new DocumentsController().uploadFile);
routes.get('/students/documents', uploadSingleFile, new DocumentsController().getFile);
routes.get('/documents', uploadSingleFile, new DocumentsController().getAllDocuments);
routes.get("/students/allDocuments", new DocumentsController().getDocuments);
routes.delete("/students/documents/:id", new DocumentsController().deleteDocument);


// Rotas de Student
routes.get("/user/student", new StudentController().getStudents);
routes.get("/user/student/:id", new StudentController().getStudentById);
routes.put("/user/student/:id", new StudentController().updateStudent);
routes.delete("/user/student/:id", new StudentController().deleteStudent);

// Rotas de User
routes.get("/user", new UserController().getUsers);
routes.delete("/user/:id", new UserController().deleteUser);
routes.put("/user", new UserController().updateUser);
routes.patch("/user/:id", new UserController().resetStudentPassword);

// Rotas de Folder
routes.post("/students/folder", new FolderController().create);
routes.get("/students/folder", new FolderController().getFolder);
routes.get("/students/allFolders", new FolderController().getAllFolders);
routes.delete("/students/folder/:id", new FolderController().deleteFolder);

export default routes;

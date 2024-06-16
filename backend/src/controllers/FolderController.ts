import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Folder } from "../entities/Folder";
import { Student } from "../entities/Student";

interface FolderResponse {
  id: number;
  name: string;
}

export class FolderController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;

    try {
      if (!req.studentUser) {
        return res.status(403).json({ error: "Favor Logar" });
      }

      if (!name) {
        return res.status(400).json({ error: "Nome da pasta é obrigatório" });
      }

      if (name.length > 20) {
        return res.status(400).json({ error: "Nome da pasta muito longo" });
      }

      const newFolder = AppDataSource.getRepository(Folder).create({
        name,
        student: req.studentUser,
      });

      await AppDataSource.getRepository(Folder).save(newFolder);

      return res.status(200).json(newFolder);
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getAllFolders(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.studentUser) {
        return res.status(403).json({ error: "Favor Logar" });
      }

      const folders = await AppDataSource.getRepository(Folder).find({
        where: { student: req.studentUser },
      });

      return res.status(200).json(folders);
    } catch (error) {
      console.error("Erro ao obter pastas:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getFolder(req: Request, res: Response): Promise<Response> {
    const idParam = req.query.id;

    try {
      if (!req.studentUser) {
        return res.status(403).json({ error: "Favor Logar" });
      }

      // Verificar se o idParam é um número válido
      const id = Number(idParam);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID de pasta inválido" });
      }

      const folder = await AppDataSource.getRepository(Folder).findOne({
        where: { id, student: req.studentUser },
      });

      if (!folder) {
        return res.status(404).json({ error: "Pasta não encontrada" });
      }

      return res.status(200).json(folder);
    } catch (error) {
      console.error("Erro ao obter pasta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async deleteFolder(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      if (!req.studentUser) {
        return res.status(403).json({ error: "Favor Logar" });
      }

      const folderRepository = AppDataSource.getRepository(Folder);
      const folder = await folderRepository.findOne({
        where: { id: Number(id), student: req.studentUser },
      });

      if (!folder) {
        return res.status(404).json({ error: "Pasta não encontrada" });
      }

      await folderRepository.remove(folder);

      return res.status(200).json({ message: "Pasta excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir pasta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

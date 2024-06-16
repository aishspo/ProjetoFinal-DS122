import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { IsNull } from "typeorm";
import path from "path";
import fs from "fs";
import { Folder } from "../entities/Folder";
import { Document } from "../entities/Document";
import { foldersRepository } from "../repository/folderRepository";
import { documentsRepository } from "../repository/documentsRepository";

export class DocumentsController {
  async uploadFile(req: Request, res: Response): Promise<Response> {
    try {
      const { folderId } = req.body;
      const file = req.file;

      console.log("Dados recebidos no upload:", {
        folderId,
        file: file?.originalname,
      });

      if (!file) {
        console.log("Erro: Nenhum arquivo enviado");
        return res.status(400).json({ message: "Nenhum arquivo enviado" });
      }

      if (!req.studentUser) {
        console.log("Erro: Usuário não logado");
        return res.status(403).json({ error: "Favor Logar" });
      }

      const documentsRepository = AppDataSource.getRepository(Document);
      const foldersRepository = AppDataSource.getRepository(Folder);

      let folder: Folder | undefined = undefined;
      if (folderId) {
        folder =
          (await foldersRepository.findOne({
            where: { id: folderId, student: req.studentUser },
          })) ?? undefined;

        if (!folder) {
          console.log(
            "Erro: Pasta não encontrada ou não pertence ao estudante"
          );
          return res.status(400).json({
            error: "Pasta não encontrada ou não pertence ao estudante",
          });
        }
      }

      const newDocument = documentsRepository.create({
        name: file.originalname,
        filePath: file.path,
        folder: folder || undefined,
        student: req.studentUser,
      });

      await documentsRepository.save(newDocument);

      console.log("Novo documento criado:", newDocument); // Log detalhado

      return res.status(201).json(newDocument);
    } catch (error) {
      console.error("Erro ao realizar upload do arquivo:", error);
      return res.status(500).json({
        message: "Erro ao realizar upload do arquivo",
        error: (error as Error).message,
      });
    }
  }

  async getAllDocuments(req: Request, res: Response): Promise<Response> {
    try {
      const documentRepository = AppDataSource.getRepository(Document);
      const documents = await documentRepository.find({
        relations: ["student"],
      });

      return res.status(200).json(documents);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const documentRepository = AppDataSource.getRepository(Document);
      const document = await documentRepository.findOne({
        where: { id: parseInt(id, 10) },
      });

      if (!document) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }

      // Verifica se o arquivo existe
      if (!fs.existsSync(document.filePath)) {
        res.status(404).json({ message: "Arquivo não encontrado" });
        return;
      }

      // Envia o arquivo
      res.sendFile(path.resolve(document.filePath));
    } catch (error) {
      res.status(500).json({
        message: "Erro ao obter arquivo",
        error: (error as Error).message,
      });
    }
  }

  async getDocuments(req: Request, res: Response): Promise<Response> {
    const id = Number(req.query.id);

    try {
      if (!req.studentUser) {
        return res.status(401).json({ error: "Favor logar!" });
      }

      if (id === null || id === 0) {
        const documents = await documentsRepository.find({
          where: { folder: IsNull(), student: req.studentUser },
        });
        return res.status(200).json(documents);
      }

      if (typeof id === "number" && !isNaN(id)) {
        const folder = await foldersRepository.findOne({
          where: { id, student: req.studentUser },
        });
        if (!folder) {
          return res.status(404).json({ error: "Pasta não encontrada." });
        }

        const document = await documentsRepository.find({
          where: { folder: folder, student: req.studentUser },
        });
        return res.status(200).json(document);
      } else {
        return res
          .status(400)
          .json({ error: "O id da pasta enviado está como string." });
      }
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar documentos." });
    }
  }

  async deleteDocument(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
  
      if (!req.studentUser) {
        return res.status(401).json({ error: "Favor logar!" });
      }
  
      const document = await documentsRepository.findOne({
        where: { id: parseInt(id, 10), student: req.studentUser },
      });
  
      if (!document) {
        return res.status(404).json({ message: "Documento não encontrado" });
      }
  
      // Remove o arquivo fisicamente
      const filePath = path.resolve(document.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
  
      // Remove o documento do banco de dados
      await documentsRepository.delete({ id: document.id });
  
      return res.status(200).json({ message: "Documento deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      return res.status(500).json({
        message: "Erro ao deletar documento",
        error: (error as Error).message,
      });
    }
  }
}

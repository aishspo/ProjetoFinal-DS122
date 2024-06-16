import { Request, Response } from "express";
import { userRepository } from "../repository/userRepository";
import { studentsRepository } from "../repository/studentsRepository";
import { Student } from "../entities/Student";
import { FindOneOptions, getConnection, getRepository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import { Folder } from "../entities/Folder";
import { Document } from "../entities/Document";

export class StudentController {
  async getStudents(req: Request, res: Response): Promise<Response> {
    try {
      const students = await studentsRepository
        .createQueryBuilder("student")
        .leftJoinAndSelect("student.user", "user") // Realiza uma junção com a tabela user
        .select(["student.id", "student.name", "user.email"]) // Seleciona apenas os campos desejados
        .getMany();

      return res.status(200).json(students);
    } catch (error) {
      console.error("Erro ao obter estudantes:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getStudentById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      // Obter o repositório do estudante usando DataSource
      const studentRepository = AppDataSource.getRepository(Student);

      // Buscar o estudante pelo ID com seu usuário relacionado
      const student = await studentRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["user"],
      });

      if (!student) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }

      // Preparar os dados do estudante para resposta
      const studentData = {
        id: student.id,
        name: student.name,
        email: student.user.email,
      };

      return res.status(200).json({ student: studentData });
    } catch (error) {
      console.error("Erro ao buscar aluno:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async updateStudent(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; // Assumindo que o ID do estudante é passado na URL
    const { name, email, password } = req.body;

    const studentRepository = AppDataSource.getRepository(Student);
    const userRepository = AppDataSource.getRepository(User);

    try {
      // Validar os dados de entrada
      if (!email && !name && !password) {
        return res.status(400).json({
          error:
            "Pelo menos um campo (nome, email ou senha) deve ser fornecido.",
        });
      }

      // Encontrar o estudante pelo ID
      const student = await studentRepository.findOne({
        where: { id: Number(id) },
        relations: ["user"],
      });

      if (!student) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }

      // Atualizar dados
      if (name) student.name = name;
      if (email) student.user.email = email;
      if (password) student.user.password = await bcrypt.hash(password, 10);

      // Salvar alterações nos repositórios
      await userRepository.save(student.user);
      await studentRepository.save(student);

      // Preparar e enviar a resposta
      const updatedStudentData = {
        id: student.id,
        name: student.name,
        email: student.user.email,
      };

      return res.status(200).json({ student: updatedStudentData });
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async deleteStudent(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    // Verifica se o ID é um número válido
    const studentId = Number(id);
    if (isNaN(studentId)) {
      return res.status(400).json({ error: "ID de estudante inválido" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const studentsRepository = AppDataSource.getRepository(Student);
    const foldersRepository = AppDataSource.getRepository(Folder);
    const documentsRepository = AppDataSource.getRepository(Document);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verifica se o estudante existe e carrega a relação user e folders
      const student = await studentsRepository.findOne({
        where: { id: studentId },
        relations: ["user", "folders", "folders.documents"],
      });

      if (!student) {
        return res.status(404).json({ error: "Estudante não encontrado" });
      }

      // Verifica se o usuário do estudante existe
      const user = student.user;
      if (!user) {
        return res
          .status(404)
          .json({ error: "Usuário do estudante não encontrado" });
      }

      // Remove os documentos associados às pastas do estudante
      for (const folder of student.folders) {
        const folderDocuments = await documentsRepository.find({
          where: { folder: folder.documents },
        });
        await documentsRepository.remove(folderDocuments);
      }

      // Remove as pastas do estudante
      await foldersRepository.remove(student.folders);

      // Remove o estudante e o usuário
      await studentsRepository.remove(student);
      await userRepository.remove(user);

      await queryRunner.commitTransaction();

      return res
        .status(200)
        .json({ message: "Estudante, usuário e pastas excluídos com sucesso" });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Erro ao excluir estudante, usuário e pastas:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      await queryRunner.release();
    }
  }
}

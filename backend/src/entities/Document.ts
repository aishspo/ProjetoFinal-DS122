import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Folder } from "./Folder";
import { Student } from "./Student";

@Entity("documents")
@Unique(["id"])
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true }) // Permitindo que o caminho do arquivo seja nulo caso nenhum arquivo seja enviado
  filePath: string;

  @ManyToOne(() => Folder, (folder) => folder.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'folderId' })
  folder: Folder;

  @ManyToOne(() => Student, (student) => student.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;
}

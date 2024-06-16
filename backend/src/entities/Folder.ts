import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Document } from './Document';
import { Student } from './Student';

@Entity('folders')
@Unique(['id'])
export class Folder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: '' }) // Definindo um valor padrão para filePath
    filePath: string;
    
    @ManyToOne(() => Student, student => student.folders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'studentId' })
    student: Student;

    @OneToMany(() => Document, document => document.folder)
    documents: Document[];
}

use projetosagu;

select * from projetosagu.users;
select * from projetosagu.students;
select * from projetosagu.teachers;

-- Passo 1: Desabilitar temporariamente as restrições de chave estrangeira
SET FOREIGN_KEY_CHECKS = 0;

-- Passo 2: Excluir os dados das tabelas
delete from projetosagu.students;
delete from projetosagu.teachers;
delete from projetosagu.users;

-- Passo 3: Habilitar as restrições de chave estrangeira
SET FOREIGN_KEY_CHECKS = 1;

select * from projetosagu.documents;
select * from projetosagu.folders;

-- -- 

DROP TABLE IF EXISTS projetosagu.documents;
DROP TABLE IF EXISTS projetosagu.folders;
DROP TABLE IF EXISTS projetosagu.users;
DROP TABLE IF EXISTS projetosagu.students;
DROP TABLE IF EXISTS projetosagu.teachers;
DROP TABLE IF EXISTS projetosagu.migrations;

/* 
User
-id
-email
-password

Student
-id
-nome
-userId

Teacher
-id
-nome
-subject 
-userId

Folder
-id
-name
-subFolder
-studentId

Documents
-id
-name
-folderId
studentId 
*/

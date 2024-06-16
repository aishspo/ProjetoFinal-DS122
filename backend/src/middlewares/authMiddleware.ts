import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { userRepository } from '../repository/userRepository';
import { studentsRepository } from '../repository/studentsRepository';
import { teacherRepository } from '../repository/teacherRepository';
import { User } from '../entities/User';

type JwtPayload = {
    id: number
}

async function getUserType(user: User): Promise<"student" | "teacher"> {
    const userStudent = await studentsRepository.findOne({ where: { user } });
    const userTeacher = await teacherRepository.findOne({ where: { user } });

    if (userStudent) {
        return "student";
    } else if (userTeacher) {
        return "teacher";
    } else {
        throw new BadRequestError('Tipo de usuário inválido!');
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new UnauthorizedError('Não autorizado');
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload;
        const user = await userRepository.findOneBy({ id });

        if (!user) {
            throw new UnauthorizedError('Não autorizado');
        }

        const userType: "student" | "teacher" = await getUserType(user);

        if (userType === "student") {
            const studentUser = await studentsRepository.findOne({ where: { user } });
            if (studentUser) {
                req.studentUser = studentUser;
            }
        } else if (userType === "teacher") {
            const teacherUser = await teacherRepository.findOne({ where: { user } });
            if (teacherUser) {
                req.teacherUser = teacherUser;
            }
        }

        const { password, ...loggedUser } = user;
        req.user = loggedUser;

        next();
    } catch (error) {
        throw new UnauthorizedError('Token inválido');
    }
};

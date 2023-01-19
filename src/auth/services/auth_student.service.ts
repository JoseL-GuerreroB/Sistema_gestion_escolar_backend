import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../dto/student_dto';
import { User } from '../dto/user_dto';
import { StatusStudents } from '../entities/status_atr.entity';
import Students from '../entities/student.entity';
import { TypesUsers } from '../entities/type_atr.entity';
import Users from '../entities/user.entity';
import { encryptPassword } from '../helpers/bcrypt';
import {
  emailAlreadyRegistered,
  usernameAlreadyRegistered,
} from '../validators/validators_user';

@Injectable()
export class AuthStudentService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Students)
    private studentsRepositoty: Repository<Students>,
    @InjectRepository(StatusStudents)
    private statusStudentsRepository: Repository<StatusStudents>,
    @InjectRepository(TypesUsers)
    private typesUsersRepository: Repository<TypesUsers>,
  ) {}

  async Create_User(newUser: User, type_user: number) {
    const userTable = this.usersRepository;
    try {
      const findUsername = await usernameAlreadyRegistered(
        userTable,
        newUser.username,
      );
      if (findUsername === false)
        throw new HttpException(
          'El username ya esta ocupado',
          HttpStatus.CONFLICT,
        );
      const findEmail = await emailAlreadyRegistered(userTable, newUser.email);
      if (findEmail === false)
        throw new HttpException(
          'El correo ya esta registrado',
          HttpStatus.CONFLICT,
        );
      let user = newUser;
      user.password = await encryptPassword(newUser.password);
      const typeUser = await this.typesUsersRepository.findOne({
        where: {
          id: type_user,
        },
      });
      if (!typeUser)
        throw new HttpException(
          'Tipo de usuario no registrado',
          HttpStatus.NOT_FOUND,
        );
      user['type_user'] = typeUser;
      user = this.usersRepository.create(user);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new HttpException('Error del servidor: ' + error.message, 500);
    }
  }

  async Incomplete_Register(username: string, email: string) {
    try {
      const existUser = await this.usersRepository.findOne({
        where: {
          username,
          email,
        },
      });
      console.log(existUser);
      if (!existUser) return false;
      const existStudent = await this.studentsRepositoty.findOne({
        where: {
          user: existUser,
        },
      });
      console.log(existStudent);
      if (existStudent) return false;
      return existUser;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error del servidor: ' + error.message, 500);
    }
  }

  async Create_Student(
    newStudent: Student,
    fromUser: object,
    status_student: number,
  ) {
    let student = newStudent;
    try {
      const statusStudent = await this.statusStudentsRepository.findOne({
        where: {
          id: status_student,
        },
      });
      if (!statusStudent)
        throw new HttpException(
          'Status de alumno no registrado',
          HttpStatus.NOT_FOUND,
        );
      student['status_student'] = statusStudent;
      student['user'] = fromUser;
      student = this.studentsRepositoty.create(student);
      return await this.studentsRepositoty.save(student);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error del servidor: ' + error.message,
        error.status,
      );
    }
  }
}

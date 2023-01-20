import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../dto/student_dto';
import { Login_DTO } from '../dto/user_dto';
import { StatusStudents } from '../entities/status_atr.entity';
import Students from '../entities/student.entity';
import Users from '../entities/user.entity';
import { userLogin } from '../helpers/validators/validators_user';

@Injectable()
export class AuthStudentService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Students)
    private studentsRepositoty: Repository<Students>,
    @InjectRepository(StatusStudents)
    private statusStudentsRepository: Repository<StatusStudents>,
  ) {}

  async Incomplete_Register_Student(username: string, email: string) {
    const existUser = await this.usersRepository.findOne({
      where: {
        username,
        email,
      },
    });
    if (!existUser) return false;
    const existStudent = await this.studentsRepositoty.findOne({
      where: {
        user: existUser,
      },
    });
    if (existStudent) return false;
    return existUser;
  }

  async Create_Student(
    newStudent: Student,
    fromUser: object,
    status_student: number,
  ) {
    let student = newStudent;
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
  }

  async Login_Student(dataLogin: Login_DTO) {
    const existUser = await userLogin(
      this.usersRepository,
      dataLogin.email,
      dataLogin.password,
    );
    const existStudent = await this.studentsRepositoty.findOne({
      relations: ['user', 'user.type_user', 'status_student'],
      where: {
        user: existUser,
      },
    });
    if (!existStudent)
      throw new HttpException(
        'Ocurrio un error al registrarte, vuelve a registrarte utilizando el username y el correo de la ultima vez.',
        HttpStatus.NOT_FOUND,
      );
    return existStudent;
  }
}

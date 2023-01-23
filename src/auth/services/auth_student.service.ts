import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../dto/student_dto';
import { Login_DTO } from '../dto/user_dto';
import { StatusStudents } from '../entities/status_atr.entity';
import Students from '../entities/student.entity';
import Users from '../entities/user.entity';
import { keysStudentData } from '../helpers/capture_key';
import { userLogin } from '../helpers/validators/validators_user';
import { validatorUpdateUsernameAndEmail } from '../helpers/validators/validator_students';

@Injectable()
export default class AuthStudentService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Students)
    private studentsRepositoty: Repository<Students>,
    @InjectRepository(StatusStudents)
    private statusStudentsRepository: Repository<StatusStudents>,
  ) {}

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

  Student_Data_Separation(data: any) {
    const propsUser = {};
    const propsStudent = {};
    Object.entries(data).forEach(([key, values]) => {
      if (!keysStudentData.includes(key)) propsUser[key] = values;
      else propsStudent[key] = values;
    });
    return { propsUser, propsStudent };
  }

  async Update_Student(
    idUser: number,
    newDataUser: object,
    idStudent: number,
    newDataStudent?: object,
  ) {
    console.log(newDataUser, newDataStudent);
    const data = await validatorUpdateUsernameAndEmail(
      idUser,
      newDataUser['username'],
      newDataUser['email'],
      this.usersRepository,
    );
    console.log(data);
    if (data.username === false) newDataUser['username'] = undefined;
    const user = newDataUser;
    if (newDataStudent) {
      if (data.email === false) newDataUser['email'] = undefined;
      const student = newDataStudent;
      const status_student = await this.statusStudentsRepository.findOne({
        where: {
          id: newDataStudent['status_student'],
        },
      });
      student['status_student'] = status_student;
      await this.studentsRepositoty.update({ id: idStudent }, student);
    }
    await this.usersRepository.update({ id: idUser }, user);
    return await this.Sesion_Student_With_Jwt(idStudent);
  }

  async Del_Student(idUser: number, idStudent: number) {
    await this.studentsRepositoty.delete({ id: idStudent });
    await this.usersRepository.delete({ id: idUser });
    return { ok: true, message: 'Estudiante eliminado' };
  }

  async Sesion_Student_With_Jwt(id: number) {
    const student = await this.studentsRepositoty.findOne({
      relations: ['user', 'user.type_user', 'status_student'],
      where: {
        id,
      },
    });
    student.user.password = undefined;
    return student;
  }
}

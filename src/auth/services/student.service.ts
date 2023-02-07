import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { keysStudentData } from '../helpers/capture_key';

import { StatusStudents } from '../entities/status_atr.entity';
import Students from '../entities/student.entity';

@Injectable()
export default class StudentService {
  constructor(
    @InjectRepository(Students)
    private StudentRepositoty: Repository<Students>,
    @InjectRepository(StatusStudents)
    private StatusStudentRepository: Repository<StatusStudents>,
  ) {}

  async Create_Student_Service(fromUser: object, data: any) {
    let student = data;
    const statusStudent = await this.StatusStudentRepository.findOne({
      where: {
        id: 1,
      },
    });
    student['status_student'] = statusStudent;
    student['user'] = fromUser;
    student = this.StudentRepositoty.create(student);
    return await this.StudentRepositoty.save(student);
  }

  async Login_Student(fromUser: object) {
    const existStudent = await this.StudentRepositoty.findOne({
      relations: ['user', 'user.type_user', 'status_student'],
      where: {
        user: fromUser,
      },
    });
    if (!existStudent)
      throw new HttpException(
        'No se ha detectado ninguna cuenta de estudiante.',
        HttpStatus.NOT_FOUND,
      );
    return existStudent;
  }

  async Sesion_Student_With_Jwt(id: number) {
    const student = await this.StudentRepositoty.findOne({
      relations: ['user', 'user.type_user', 'status_student'],
      where: {
        id,
      },
    });
    student.user.password = undefined;
    return student;
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

  async Update_Student_Service(idStudent: number, data: any) {
    const student = data;
    if (data['status_student']) {
      const status_student = await this.StatusStudentRepository.findOne({
        where: {
          id: data['status_student'],
        },
      });
      student['status_student'] = status_student;
    }
    await this.StudentRepositoty.update({ id: idStudent }, student);
    return await this.Sesion_Student_With_Jwt(idStudent);
  }

  async Delete_Student_Service(idStudent: number) {
    await this.StudentRepositoty.delete({ id: idStudent });
    return { ok: true, message: 'Estudiante eliminado' };
  }
}

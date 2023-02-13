import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Teachers from '../entities/teacher.entity';
import { keysEmployeData, keysTeacherData } from '../helpers/capture_key';

@Injectable()
export default class TeacherService {
  constructor(
    @InjectRepository(Teachers) private TeacherRepository: Repository<Teachers>,
  ) {}

  async Create_Teacher_Service(fromEmploye: object, data: any) {
    let teacher = data;
    teacher['employe'] = fromEmploye;
    teacher = this.TeacherRepository.create(teacher);
    await this.TeacherRepository.save(teacher);
    return;
  }

  async Login_Teacher(fromEmploye: object) {
    return await this.TeacherRepository.findOne({
      relations: [
        'employe',
        'employe.type_employe',
        'employe.status_employe',
        'employe.job',
        'employe.user',
        'employe.user.type_user',
        'employe.user.roles',
      ],
      where: {
        employe: fromEmploye,
      },
    });
  }

  async Sesion_Teacher_With_Jwt(id: number) {
    const teacher = await this.TeacherRepository.findOne({
      relations: [
        'employe',
        'employe.type_employe',
        'employe.status_employe',
        'employe.job',
        'employe.user',
        'employe.user.type_user',
      ],
      where: {
        id,
      },
    });
    teacher.employe.user.password = undefined;
    return teacher;
  }

  Teacher_Data_Separation(data: any) {
    const propsUser = {};
    const propsEmploye = {};
    const propsTeacher = {};
    Object.entries(data).forEach(([key, values]) => {
      if (!keysEmployeData.includes(key) && !keysTeacherData.includes(key))
        propsUser[key] = values;
      else if (!keysTeacherData.includes(key)) propsEmploye[key] = values;
      else propsTeacher[key] = values;
    });
    return { propsUser, propsEmploye, propsTeacher };
  }

  async Update_Teacher_Service(idTeacher: number, data: any) {
    await this.TeacherRepository.update({ id: idTeacher }, data);
    return;
  }

  async Delete_Teacher_Service(idTeacher: number) {
    await this.TeacherRepository.delete({ id: idTeacher });
    return { ok: true, message: 'Profesor eliminado' };
  }
}

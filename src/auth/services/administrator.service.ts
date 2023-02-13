import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Administrators from '../entities/administrator.entity';
import { TypesAdministrators } from '../entities/type_atr.entity';
import { keysAdminData, keysEmployeData } from '../helpers/capture_key';

@Injectable()
export default class AdministratorService {
  constructor(
    @InjectRepository(Administrators)
    private AdminRepository: Repository<Administrators>,
    @InjectRepository(TypesAdministrators)
    private TypeAdminRepository: Repository<TypesAdministrators>,
  ) {}

  async Create_Admin_Service(fromEmploye: object, data: any) {
    let admin = data;
    const typeAdmin = await this.TypeAdminRepository.findOne({
      where: {
        id: data['type_Administrator'],
      },
    });
    admin['type_administrator'] = typeAdmin;
    admin['employe'] = fromEmploye;
    admin = this.AdminRepository.create(admin);
    await this.AdminRepository.save(admin);
    return;
  }

  async Login_Admin(fromEmploye: object) {
    return await this.AdminRepository.findOne({
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

  async Sesion_Admin_With_Jwt(id: number) {
    const administrator = await this.AdminRepository.findOne({
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
    administrator.employe.user.password = undefined;
    return administrator;
  }

  Admin_Data_Separation(data: any) {
    const propsUser = {};
    const propsEmploye = {};
    const propsAdmin = {};
    Object.entries(data).forEach(([key, values]) => {
      if (!keysEmployeData.includes(key) && !keysAdminData.includes(key))
        propsUser[key] = values;
      else if (!keysAdminData.includes(key)) propsEmploye[key] = values;
      else propsAdmin[key] = values;
    });
    return { propsUser, propsEmploye, propsAdmin };
  }

  async Update_Admin_Service(idAdmin: number, data: any) {
    const admin = data;
    if (data['type_administrator']) {
      const typeAdmin = await this.TypeAdminRepository.findOne({
        where: {
          id: data['type_administrator'],
        },
      });
      if (!typeAdmin)
        throw new HttpException(
          'Typo de administrador no registrado',
          HttpStatus.NOT_FOUND,
        );
      admin['type_administrator'] = typeAdmin;
    }
    await this.AdminRepository.update({ id: idAdmin }, admin);
    return;
  }

  async Delete_Admin_Service(id: number) {
    await this.AdminRepository.delete({ id });
    return { ok: true, message: 'Administrador eliminado' };
  }
}

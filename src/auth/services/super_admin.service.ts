import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SuperAdministrators from '../entities/super_admin.entity';
import { keysEmployeData, keysSuperAdminData } from '../helpers/capture_key';

@Injectable()
export default class SuperAdministratorService {
  constructor(
    @InjectRepository(SuperAdministrators)
    private SuperAdminRepository: Repository<SuperAdministrators>,
  ) {}

  async Create_SuperAdmin_Service(fromEmploye: object, data: any) {
    let superadmin = data;
    superadmin['employe'] = fromEmploye;
    superadmin = this.SuperAdminRepository.create(superadmin);
    await this.SuperAdminRepository.save(superadmin);
    return;
  }

  async Login_SuperAdmin(fromEmploye: object) {
    return await this.SuperAdminRepository.findOne({
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

  async Sesion_SuperAdmin_With_Jwt(id: number) {
    const superAdmin = await this.SuperAdminRepository.findOne({
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
    superAdmin.employe.user.password = undefined;
    return superAdmin;
  }

  SuperAdmin_Data_Separation(data: any) {
    const propsUser = {};
    const propsEmploye = {};
    const propsSuperAdmin = {};
    Object.entries(data).forEach(([key, values]) => {
      if (!keysEmployeData.includes(key) && !keysSuperAdminData.includes(key))
        propsUser[key] = values;
      else if (!keysSuperAdminData.includes(key)) propsEmploye[key] = values;
      else propsSuperAdmin[key] = values;
    });
    return { propsUser, propsEmploye, propsSuperAdmin };
  }

  async Update_SuperAdmin_Service(idSuperAdmin: number, data: any) {
    await this.SuperAdminRepository.update({ id: idSuperAdmin }, data);
    return;
  }

  async Delete_SuperAdmin_Service(idSuperAdmin: number) {
    await this.SuperAdminRepository.delete({ id: idSuperAdmin });
    return { ok: true, message: 'Super administrador eliminado' };
  }
}

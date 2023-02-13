import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SuperUsers from '../entities/super_user.entity';

@Injectable()
export default class SuperUserService {
  constructor(
    @InjectRepository(SuperUsers)
    private SuperUserRepository: Repository<SuperUsers>,
  ) {}

  async Create_SuperUser_Service(fromUser: object, data: any) {
    let superUser = data;
    superUser['user'] = fromUser;
    superUser = this.SuperUserRepository.create(superUser);
    await this.SuperUserRepository.save(superUser);
    return;
  }

  async Login_SuperUser(fromUser: object) {
    const existSuperUser = await this.SuperUserRepository.findOne({
      relations: ['user', 'user.type_user', 'status_student', 'user.roles'],
      where: {
        user: fromUser,
      },
    });
    if (!existSuperUser)
      throw new HttpException(
        'No se ha detectado ninguna cuenta de estudiante.',
        HttpStatus.NOT_FOUND,
      );
    return existSuperUser;
  }

  async Sesion_SuperUser_With_Jwt(id: number) {
    const superUser = await this.SuperUserRepository.findOne({
      relations: ['user', 'user.type_user'],
      where: {
        id,
      },
    });
    superUser.user.password = undefined;
    return superUser;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Create_Student_DTO } from './dto/student_dto';
import { User } from './dto/user_dto';
import { TypesUsers } from './entities/type_atr.entity';
import Users from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(TypesUsers)
    private typesUsersRepository: Repository<TypesUsers>,
  ) {}

  async Create_User(newUser: User, type_user: number) {
    try {
      const findUsername = await this.usersRepository.findOne({
        where: {
          username: newUser.username,
        },
      });
      if (findUsername)
        return new HttpException(
          'El username ya esta ocupado',
          HttpStatus.CONFLICT,
        );
      const findEmail = await this.usersRepository.findOne({
        where: {
          email: newUser.email,
        },
      });
      if (findEmail)
        return new HttpException(
          'El correo ya esta registrado',
          HttpStatus.CONFLICT,
        );
      let user = newUser;
      const typeUser = await this.typesUsersRepository.findOne({
        where: {
          id: type_user,
        },
      });
      user['type_user'] = typeUser;
      user = this.usersRepository.create(newUser);
      return user;
    } catch (error) {
      return newUser;
    }
  }

  Register_Student_Service(student: Create_Student_DTO) {
    return student;
  }
}

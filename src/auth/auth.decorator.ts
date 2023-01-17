import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Users from './entities/user.entity';

@Injectable()
export class AuthDecorators {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  Unused_Username_Decorators(userName: string) {
    console.log('si pase');
    return this.usersRepository.findOne({
      where: {
        username: userName,
      },
    });
  }
}

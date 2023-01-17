import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from './entities/user.entity';
import Students from './entities/student.entity';
import Employees from './entities/employe.entity';
import Teachers from './entities/teacher.entity';
import { TypesUsers } from './entities/type_atr.entity';
import { AuthDecorators } from './auth.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      TypesUsers,
      Students,
      Employees,
      Teachers,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthDecorators],
  exports: [AuthService, AuthDecorators],
})
export class AuthModule {}

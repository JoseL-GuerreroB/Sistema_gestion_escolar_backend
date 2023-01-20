import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './helpers/strategies/accessToken.strategy';
import { RefreshAccessTokenStrategy } from './helpers/strategies/refreshAccessToken.strategy';
import { AuthStudentController } from './controllers/auth_student.controller';
import { AuthStudentService } from './services/auth_student.service';
import { AuthPreservice } from './services/auth_pre.service';
import Users from './entities/user.entity';
import Students from './entities/student.entity';
import Employees from './entities/employe.entity';
import Teachers from './entities/teacher.entity';
import { TypesUsers } from './entities/type_atr.entity';
import { StatusStudents } from './entities/status_atr.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      Users,
      TypesUsers,
      Students,
      Employees,
      Teachers,
      StatusStudents,
    ]),
  ],
  controllers: [AuthStudentController],
  providers: [
    RefreshAccessTokenStrategy,
    AccessTokenStrategy,
    AuthPreservice,
    AuthStudentService,
  ],
  exports: [AuthStudentService],
})
export class AuthModule {}

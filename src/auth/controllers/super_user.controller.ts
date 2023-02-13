import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Create_SuperUser_DTO } from '../dto/super_user_dto';
import { keysSuperUserData } from '../helpers/capture_key';
import { Roles } from '../helpers/roles/role.decorator';
import { RolesGuard } from '../helpers/roles/role.guard';
import SuperUserService from '../services/super_user.service';
import UserService from '../services/user.service';

@Controller('auth_superuser')
export default class SuperUserController {
  constructor(
    private userService: UserService,
    private superUserService: SuperUserService,
  ) {}

  @Post('register')
  @Roles('Super usuario')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Register_Student(@Body() data: Create_SuperUser_DTO) {
    try {
      const dataUser = {};
      const dataSuperUser = {};
      Object.entries(data).forEach(([key, values]) => {
        if (!keysSuperUserData.includes(key)) dataUser[key] = values;
        else dataSuperUser[key] = values;
      });
      const user = await this.userService.Create_User_Service(dataUser, 3);
      await this.superUserService.Create_SuperUser_Service(user, dataSuperUser);
      return { ok: true, message: 'Super usuario creado exitosamente' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import {
  Create_SuperAdministrator_DTO,
  Update_Private_Data_SuperAdmin_DTO,
  Update_Public_Data_SuperAdmin_DTO,
} from '../dto/super_admin_dto';
import { keysEmployeData, keysSuperAdminData } from '../helpers/capture_key';
import { Roles } from '../helpers/roles/role.decorator';
import { RolesGuard } from '../helpers/roles/role.guard';
import EmployeService from '../services/employe.service';
import SuperAdministratorService from '../services/super_admin.service';
import UserService from '../services/user.service';

@Controller('auth_superadmin')
export default class SuperAdministratorController {
  constructor(
    private userService: UserService,
    private employeService: EmployeService,
    private superAdminService: SuperAdministratorService,
  ) {}

  @Post('register')
  @Roles('Super usuario')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Register_SuperAdmin(@Body() data: Create_SuperAdministrator_DTO) {
    try {
      const dataUser = {};
      const dataEmploye = {};
      const dataSuperAdmin = {};
      Object.entries(data).forEach(([key, values]) => {
        if (!keysEmployeData.includes(key) && !keysSuperAdminData.includes(key))
          dataUser[key] = values;
        else if (!keysSuperAdminData.includes(key)) dataEmploye[key] = values;
        else dataSuperAdmin[key] = values;
      });
      const user = await this.userService.Create_User_Service(dataUser, 2);
      const employe = await this.employeService.Create_Employe_Service(
        user,
        dataEmploye,
      );
      await this.superAdminService.Create_SuperAdmin_Service(
        employe,
        dataSuperAdmin,
      );
      return { ok: true, message: 'Super administrador creado' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('public_update')
  @Roles('Super administrador')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Public_Update_SuperAdmin(
    @Body() data: Update_Public_Data_SuperAdmin_DTO,
    @Req() req: Request,
  ) {
    const user = req.user;
    try {
      const superAdmin =
        await this.superAdminService.Sesion_SuperAdmin_With_Jwt(user['id']);
      const newUsername = await this.userService.UniqueStringValidatorFromUser(
        superAdmin.employe.user.id,
        'username',
        data.username,
      );
      if (newUsername === false) data.username === undefined;
      const newDataSuperAdmin = data;
      const { propsUser, propsEmploye, propsSuperAdmin } =
        this.superAdminService.SuperAdmin_Data_Separation(newDataSuperAdmin);
      await this.userService.Update_User_Service(
        superAdmin.employe.user.id,
        propsUser,
      );
      if (Object.values(propsEmploye).length > 0)
        await this.employeService.Update_Employe_Service(
          superAdmin.employe.id,
          propsEmploye,
        );
      if (Object.values(propsSuperAdmin).length > 0)
        await this.superAdminService.Update_SuperAdmin_Service(
          superAdmin.id,
          propsSuperAdmin,
        );
      return await this.superAdminService.Sesion_SuperAdmin_With_Jwt(
        superAdmin.id,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('private_update/:id')
  @Roles('Super usuario')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Private_Update_SuperAdmin(
    @Body() data: Update_Private_Data_SuperAdmin_DTO,
    @Param('id') id: number,
  ) {
    try {
      const superAdmin =
        await this.superAdminService.Sesion_SuperAdmin_With_Jwt(id);
      const newUsername = await this.userService.UniqueStringValidatorFromUser(
        superAdmin.employe.user.id,
        'username',
        data.username,
      );
      if (newUsername === false) data.username === undefined;
      const newDataSuperAdmin = data;
      const { propsUser, propsEmploye, propsSuperAdmin } =
        this.superAdminService.SuperAdmin_Data_Separation(newDataSuperAdmin);
      await this.userService.Update_User_Service(
        superAdmin.employe.user.id,
        propsUser,
      );
      await this.employeService.Update_Employe_Service(
        superAdmin.employe.id,
        propsEmploye,
      );
      await this.superAdminService.Update_SuperAdmin_Service(
        superAdmin.id,
        propsSuperAdmin,
      );
      return { ok: true, message: 'Super administrador editado' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('delete/:id')
  @Roles('Super usuario')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Delete_Teacher(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const superAdmin =
        await this.superAdminService.Sesion_SuperAdmin_With_Jwt(id);
      const message = await this.superAdminService.Delete_SuperAdmin_Service(
        superAdmin.id,
      );
      await this.employeService.Delete_Employe_Service(superAdmin.employe.id);
      await this.userService.Delete_User_Service(superAdmin.employe.user.id);
      res.clearCookie('refresh_token');
      return message;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

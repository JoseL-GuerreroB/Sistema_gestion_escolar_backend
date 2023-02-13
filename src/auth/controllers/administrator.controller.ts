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
import { keysAdminData, keysEmployeData } from '../helpers/capture_key';

import {
  Create_Admin_DTO,
  Update_Private_Data_Admin_DTO,
  Update_Public_Data_Admin_DTO,
} from '../dto/administrator_dto';

import AdministratorService from '../services/administrator.service';
import EmployeService from '../services/employe.service';
import UserService from '../services/user.service';
import { RolesGuard } from '../helpers/roles/role.guard';
import { Roles } from '../helpers/roles/role.decorator';

@Controller('auth_admin')
export default class AdministratorController {
  constructor(
    private readonly userService: UserService,
    private readonly employeService: EmployeService,
    private readonly adminService: AdministratorService,
  ) {}

  @Post('register')
  @Roles('Super administrador')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Register_Admin(@Body() data: Create_Admin_DTO) {
    try {
      const dataUser = {};
      const dataEmploye = {};
      const dataAdmin = {};
      Object.entries(data).forEach(([key, values]) => {
        if (!keysEmployeData.includes(key) && !keysAdminData.includes(key))
          dataUser[key] = values;
        else if (!keysAdminData.includes(key)) dataEmploye[key] = values;
        else dataAdmin[key] = values;
      });
      const user = await this.userService.Create_User_Service(dataUser, 2);
      const employe = await this.employeService.Create_Employe_Service(
        user,
        dataEmploye,
      );
      await this.adminService.Create_Admin_Service(employe, dataAdmin);
      return { ok: true, message: 'Administrador creado' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('public_update')
  @Roles('Administrador')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Public_Update_Admin(
    @Body() data: Update_Public_Data_Admin_DTO,
    @Req() req: Request,
  ) {
    const user = req.user;
    try {
      const admin = await this.adminService.Sesion_Admin_With_Jwt(user['id']);
      const newUsername = await this.userService.UniqueStringValidatorFromUser(
        admin.employe.user.id,
        'username',
        data.username,
      );
      if (newUsername === false) data.username === undefined;
      const newDataAdmin = data;
      const { propsUser, propsEmploye, propsAdmin } =
        this.adminService.Admin_Data_Separation(newDataAdmin);
      await this.userService.Update_User_Service(
        admin.employe.user.id,
        propsUser,
      );
      if (Object.values(propsEmploye).length > 0)
        await this.employeService.Update_Employe_Service(
          admin.employe.id,
          propsEmploye,
        );
      if (Object.values(propsAdmin).length > 0)
        await this.adminService.Update_Admin_Service(admin.id, propsAdmin);
      return await this.adminService.Sesion_Admin_With_Jwt(admin.id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('private_update/:id')
  @Roles('Super administrador')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Private_Update_Admin(
    @Body() data: Update_Private_Data_Admin_DTO,
    @Param('id') id: number,
  ) {
    try {
      const admin = await this.adminService.Sesion_Admin_With_Jwt(id);
      const newUsername = await this.userService.UniqueStringValidatorFromUser(
        admin.employe.user.id,
        'username',
        data.username,
      );
      const newEmail = await this.userService.UniqueStringValidatorFromUser(
        admin.employe.user.id,
        'email',
        data.email,
      );
      if (newUsername === false) data.username === undefined;
      if (newEmail === false) data.email === undefined;
      const newDataAdmin = data;
      const { propsUser, propsEmploye, propsAdmin } =
        this.adminService.Admin_Data_Separation(newDataAdmin);
      await this.userService.Update_User_Service(
        admin.employe.user.id,
        propsUser,
      );
      await this.employeService.Update_Employe_Service(
        admin.employe.id,
        propsEmploye,
      );
      await this.adminService.Update_Admin_Service(admin.id, propsAdmin);
      return { ok: true, message: 'Administrador editado' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('delete/:id')
  @Roles('Super administrador')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Delete_Admin(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const admin = await this.adminService.Sesion_Admin_With_Jwt(id);
      const message = await this.adminService.Delete_Admin_Service(admin.id);
      await this.employeService.Delete_Employe_Service(admin.employe.id);
      await this.userService.Delete_User_Service(admin.employe.user.id);
      res.clearCookie('refresh_token');
      return message;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

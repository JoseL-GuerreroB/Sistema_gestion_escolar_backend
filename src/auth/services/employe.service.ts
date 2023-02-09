import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Employees from '../entities/employe.entity';
import Jobs from '../entities/job.entity';
import { StatusEmployees } from '../entities/status_atr.entity';
import { TypesEmployees } from '../entities/type_atr.entity';

@Injectable()
export default class EmployeService {
  constructor(
    @InjectRepository(Employees)
    private EmployeRepository: Repository<Employees>,
    @InjectRepository(TypesEmployees)
    private TypeEmployeRepository: Repository<TypesEmployees>,
    @InjectRepository(StatusEmployees)
    private StatusEmployeRepository: Repository<StatusEmployees>,
    @InjectRepository(Jobs) private JobRepository: Repository<Jobs>,
  ) {}

  async Create_Employe_Service(fromUser: object, data: any) {
    let employe = data;
    const statusEmploye = await this.StatusEmployeRepository.findOne({
      where: {
        id: 1,
      },
    });
    const typeEmploye = await this.TypeEmployeRepository.findOne({
      where: {
        id: 1,
      },
    });
    const jobEmploye = await this.JobRepository.findOne({
      where: {
        id: data.job,
      },
    });
    employe['status_employe'] = statusEmploye;
    employe['type_employe'] = typeEmploye;
    employe['job'] = jobEmploye;
    employe['user'] = fromUser;
    employe = this.EmployeRepository.create(employe);
    return await this.EmployeRepository.save(employe);
  }

  async Update_Employe_Service(idEmploye: number, data: any) {
    const employe = data;
    if (data['status_employe']) {
      const statusEmploye = await this.StatusEmployeRepository.findOne({
        where: {
          id: data['status_employe'],
        },
      });
      employe['status_employe'] = statusEmploye;
    }
    if (data['job']) {
      const job = await this.JobRepository.findOne({
        where: {
          id: data['job'],
        },
      });
      employe['job'] = job;
    }
    await this.EmployeRepository.update({ id: idEmploye }, employe);
    return;
  }

  async Delete_Employe_Service(idEmploye: number) {
    await this.EmployeRepository.delete({ id: idEmploye });
    return;
  }

  async Find_Employe_For_Login(fromUser: object) {
    return await this.EmployeRepository.findOne({
      where: {
        user: fromUser,
      },
    });
  }
}

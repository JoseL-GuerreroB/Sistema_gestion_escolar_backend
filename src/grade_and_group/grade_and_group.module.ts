import { Module } from '@nestjs/common';
import { GradeAndGroupService } from './grade_and_group.service';
import { GradeAndGroupController } from './grade_and_group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import GradesAndGroups from './entities/grade_and_group.entity';
import Subjects from './entities/subject.entity';
import ClassHours from './entities/class_hour.entity';
import Classes from './entities/class_g.entity';
import {
  Semesters,
  SemestersAverages,
  SemestersEvaluations,
} from './entities/semester.entity';
import {
  ClassShifts,
  Partials,
  TechnicalCareers,
} from './entities/help_class.entity';
import {
  PartialsEvaluations,
  EvaluationsStudents,
  StatusEvaluations,
} from './entities/evaluation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GradesAndGroups,
      Subjects,
      ClassHours,
      Classes,
      ClassShifts,
      Semesters,
      SemestersAverages,
      SemestersEvaluations,
      EvaluationsStudents,
      StatusEvaluations,
      TechnicalCareers,
      Partials,
      PartialsEvaluations,
    ]),
  ],
  controllers: [GradeAndGroupController],
  providers: [GradeAndGroupService],
})
export class GradeAndGroupModule {}

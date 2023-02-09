import { Module } from '@nestjs/common';
import { GradeAndGroupService } from './grade_and_group.service';
import { GradeAndGroupController } from './grade_and_group.controller';

@Module({
  controllers: [GradeAndGroupController],
  providers: [GradeAndGroupService]
})
export class GradeAndGroupModule {}

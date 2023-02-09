import { Controller } from '@nestjs/common';
import { GradeAndGroupService } from './grade_and_group.service';

@Controller('grade-and-group')
export class GradeAndGroupController {
  constructor(private readonly gradeAndGroupService: GradeAndGroupService) {}
}

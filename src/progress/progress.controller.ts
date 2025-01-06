import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProgressService } from './progress.service';

@ApiTags('Progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) { }

  @Post()
  @ApiOperation({ summary: 'Create a progress entry' })
  @ApiResponse({ status: 201, description: 'Progress entry created successfully' })
  @ApiBody({
    schema: {
      example: {
        studentId: 1,
        sectionId: 2,
        isCompleted: false,
      },
    },
  })
  create(@Body() body: { studentId: number; sectionId: number; isCompleted: boolean }) {
    return this.progressService.create(body);
  }

  @Get(':studentId')
  @ApiOperation({ summary: 'Get progress by student ID' })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
  findByStudent(@Param('studentId') studentId: number) {
    return this.progressService.findByStudent(studentId);
  }

  @Post('unlock-section')
  @ApiOperation({ summary: 'Unlock a section for a student' })
  @ApiResponse({ status: 200, description: 'Section unlocked successfully' })
  @ApiBody({
    schema: {
      example: {
        studentId: 1,
        sectionId: 2,
      },
    },
  })
  unlockSection(@Body() body: { sectionId: number; studentId: number }) {
    return this.progressService.unlockSection(body);
  }
}

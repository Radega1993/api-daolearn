import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CoursesService } from './courses.service';

@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new course' })
    @ApiResponse({ status: 201, description: 'Course created successfully' })
    @ApiBody({
        schema: {
            example: {
                title: 'Introduction to Programming',
                description: 'A beginner-friendly course',
                isPublished: true,
                creatorId: 1,
            },
        },
    })
    create(@Body() body: { title: string; description?: string; isPublished: boolean; creatorId: number }) {
        return this.coursesService.create(body);
    }

    @Get()
    @ApiOperation({ summary: 'Get all courses' })
    @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
    findAll() {
        return this.coursesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a course by ID' })
    @ApiResponse({ status: 200, description: 'Course retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    findOne(@Param('id') id: number) {
        return this.coursesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a course' })
    @ApiResponse({ status: 200, description: 'Course updated successfully' })
    @ApiBody({
        schema: {
            example: {
                title: 'Updated Course Title',
                description: 'Updated description',
                isPublished: false,
            },
        },
    })
    update(@Param('id') id: number, @Body() body: Partial<{ title: string; description: string; isPublished: boolean }>) {
        return this.coursesService.update(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a course' })
    @ApiResponse({ status: 200, description: 'Course deleted successfully' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    remove(@Param('id') id: number) {
        return this.coursesService.remove(id);
    }
}

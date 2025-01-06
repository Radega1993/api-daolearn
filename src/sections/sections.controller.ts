import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SectionsService } from './sections.service';

@ApiTags('Sections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sections')
export class SectionsController {
    constructor(private readonly sectionsService: SectionsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a section' })
    @ApiResponse({ status: 201, description: 'Section created successfully' })
    @ApiBody({
        schema: {
            example: {
                name: 'Introduction',
                isUnlocked: false,
                courseId: 1,
            },
        },
    })
    create(@Body() body: { name: string; isUnlocked: boolean; courseId: number }) {
        return this.sectionsService.create(body);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sections' })
    @ApiResponse({ status: 200, description: 'Sections retrieved successfully' })
    findAll() {
        return this.sectionsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a section by ID' })
    @ApiResponse({ status: 200, description: 'Section retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Section not found' })
    findOne(@Param('id') id: number) {
        return this.sectionsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a section' })
    @ApiResponse({ status: 200, description: 'Section updated successfully' })
    @ApiBody({
        schema: {
            example: {
                name: 'Updated Section Name',
                isUnlocked: true,
            },
        },
    })
    update(@Param('id') id: number, @Body() body: Partial<{ name: string; isUnlocked: boolean }>) {
        return this.sectionsService.update(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a section' })
    @ApiResponse({ status: 200, description: 'Section deleted successfully' })
    @ApiResponse({ status: 404, description: 'Section not found' })
    remove(@Param('id') id: number) {
        return this.sectionsService.remove(id);
    }
}

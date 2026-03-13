import { Controller, Get, Put, Param, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateData: Partial<User>) {
        return this.usersService.update(id, updateData);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}

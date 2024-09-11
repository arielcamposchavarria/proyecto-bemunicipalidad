import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('Users')
export class UserContoller {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return await this.userService.createUser(userData);
  }
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return await this.userService.updateUser(id, userData);
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}

import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FindOneParams } from '../find-one.params';
import { GetUserDto } from './dto/get-user.dto';
import { PageDto } from 'src/dto/page.dto';
import { plainToInstance } from 'class-transformer';
import { Request as ERequest } from 'express';
import { Response } from 'express';
import { RoleEnum } from '@prisma/client';
import { RoleGuard } from '../auth/role.guard';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserPaginatedDto } from './dto/user.paginated.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return plainToInstance(GetUserDto, user);
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams) {
    const { id } = params;
    const user = await this.userService.getUser(id);
    return plainToInstance(GetUserDto, user);
  }

  @Get()
  async getUsers(): Promise<GetUserDto[]> {
    const users = await this.userService.getUsers();
    return plainToInstance(GetUserDto, users);
  }

  @Put()
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateUser(updateUserDto);
    return plainToInstance(GetUserDto, user);
  }

  @UseGuards(AuthGuard, new RoleGuard([RoleEnum.admin]))
  @Delete(':id')
  async deleteUser(@Param() params: FindOneParams, @Res() res: Response) {
    const { id } = params;
    const response = await this.userService.deleteUser(id);
    return res.status(response.statusCode).json(response.toJson());
  }

  @Put('change-password')
  async updateUserPassword(@Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    const user = await this.userService.updateUserPassword(updateUserPasswordDto);
    return plainToInstance(GetUserDto, user);
  }

  @UseGuards(AuthGuard)
  @Get('profile/me')
  async getMe(@Request() req: ERequest) {
    const userId = req.user.sub;
    const user = await this.userService.getUser(userId);
    return plainToInstance(GetUserDto, user);
  }

  @Get('all/paginated')
  async getUsersPaginated(@Query() page: PageDto): Promise<UserPaginatedDto<GetUserDto>> {
    const usersPaginated = await this.userService.getUsersPaginated(page);
    return plainToInstance(UserPaginatedDto<GetUserDto>, usersPaginated);
  }
}

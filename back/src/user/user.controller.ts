import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/user.create.dto';
import { UserResponse } from '@app/user/types/user-response.interface';
import { LoginUserDto } from '@app/user/dto/user.login';
import { UserEntity } from '@app/user/user.entity';
import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserUpdateDto } from '@app/user/dto/user.update.dto';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
import { Response } from 'express';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new BackendValidationPipe())
  @Post('users')
  async create(
    @Body('user') createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    const user = await this.userService.crateUser(createUserDto);
    const response = this.userService.buildUserResponse(user);
    this.userService.setCookie(res, response.user.token);
    return response;
  }

  @UsePipes(new BackendValidationPipe())
  @Post('users/login')
  async login(
    @Body('user') loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    const user = await this.userService.login(loginUserDto);
    const response = this.userService.buildUserResponse(user);
    this.userService.setCookie(res, response.user.token);
    return response;
  }

  @UseGuards(AuthGuard)
  @Post('users/log-out')
  @HttpCode(HttpStatus.OK)
  logOut(@Res({ passthrough: true }) res: Response) {
    this.userService.logOut(res);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponse> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') userUpdateDto: UserUpdateDto,
  ): Promise<UserResponse> {
    const user = await this.userService.updateUser(
      currentUserId,
      userUpdateDto,
    );

    return this.userService.buildUserResponse(user);
  }
}

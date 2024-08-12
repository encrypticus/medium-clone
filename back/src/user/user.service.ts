import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/user.create.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/configs/jwt.config';
import { UserResponse } from '@app/user/types/user-response.interface';
import { LoginUserDto } from '@app/user/dto/user.login';
import { compare } from 'bcrypt';
import { UserUpdateDto } from '@app/user/dto/user.update.dto';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async crateUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };

    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    const userByName = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'Email is already in use';
    }

    if (userByName) {
      errorResponse.errors['username'] = 'Username is already in use';
    }

    if (userByName || userByEmail) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  buildUserResponse(user: UserEntity): UserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

  setCookie(response: Response, token: string) {
    response.cookie('jwtToken', token, {
      httpOnly: true,
      // sameSite: 'none',
      path: '/',
      // secure: true,
    });
    response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.header('Access-Control-Allow-Credentials', 'true');
  }

  private generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
    );
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        'email or password': 'is invalid',
      },
    };

    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
    });

    if (!user) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    delete user.password;

    return user;
  }

  logOut(res: Response) {
    res.clearCookie('jwtToken');
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async updateUser(
    userId: number,
    userUpdateDto: UserUpdateDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    return await this.userRepository.save({ ...user, ...userUpdateDto });
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { ProfileResponse } from '@app/profile/types/profile-response.interface';
import { ProfileType } from '@app/profile/types/profile.type';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  buildProfileResponse(profile: ProfileType): ProfileResponse {
    delete profile.email;
    return { profile };
  }

  async getProfile(
    username: string,
    currentUserId: number,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    return { ...user, following: !currentUserId ? false : Boolean(follow) };
  }

  async followProfile(
    username: string,
    currentUserId: number,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        "Follower and following can't be equal",
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    let following: boolean;

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
      following = true;
    } else {
      await this.followRepository.delete({
        followerId: currentUserId,
        followingId: user.id,
      });
      following = false;
    }

    return { ...user, following };
  }

  async unfollowProfile(
    username: string,
    currentUserId: number,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        "Follower and following can't be equal",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id,
    });

    return { ...user, following: false };
  }
}

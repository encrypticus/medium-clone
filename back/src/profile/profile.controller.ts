import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from '@app/profile/profile.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { ProfileResponse } from '@app/profile/types/profile-response.interface';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.getProfile(
      username,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.followProfile(
      username,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @User('id') currentUserId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.unfollowProfile(
      username,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}

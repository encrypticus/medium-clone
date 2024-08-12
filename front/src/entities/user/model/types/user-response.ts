import type { UserEntity } from '@/src/entities/user/model/types/user.entity';

export interface UserResponse {
  user: UserEntity & { token: string };
}

import type { UserLoginDto } from './user-login.dto';

export interface UserSignUpDto extends UserLoginDto {
  username: string;
}

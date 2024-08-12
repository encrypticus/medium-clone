import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly text: string;
}

import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { UserDto } from './user.dto';

export class UpdateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  id: number;
}

export class UpdateUserPasswordDto extends UserDto {
  @IsNotEmpty()
  currentPassword: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNumber()
  @Min(1)
  id: number;
}

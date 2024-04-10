import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserDto } from 'src/modules/user/dto/user.dto';

export class AuthDto extends UserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class GetAuthDto {
  @Expose()
  access_token: string;
}

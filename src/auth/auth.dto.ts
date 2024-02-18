import { Role } from "@modules/user-identity";
import { IsEmail, IsString, IsUrl, Matches, MinLength } from "@nestjs/class-validator";
import { IsEnum, IsIn } from "class-validator";

export class AddUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsUrl()
  picture: string;

  @IsEmail()
  username: string;

  @IsString()
  @IsEnum(Role)
  role: Role;

  @MinLength(8)
  @Matches(
  new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"),
  {
    message: 'Password must be at least eight characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  password: string;
}

export class LoginDTO {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}
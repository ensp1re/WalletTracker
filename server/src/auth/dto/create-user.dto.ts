import {
  IsEmail,
  IsEthereumAddress,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEthereumAddress()
  address: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;
}

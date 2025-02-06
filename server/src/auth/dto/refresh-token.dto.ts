import { IsEthereumAddress, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsEthereumAddress()
  address: string;

  @IsString()
  refreshToken: string;
}

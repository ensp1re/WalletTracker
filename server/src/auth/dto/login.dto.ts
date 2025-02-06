import { IsEthereumAddress, IsString } from 'class-validator';

export class LoginDto {
  @IsEthereumAddress()
  address: string;

  @IsString()
  nonce: string;

  @IsString()
  signature: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class TokenInfo {
  @ApiProperty()
  address: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  decimals: number;
}

export class TokenTransfer {
  @ApiProperty()
  token: TokenInfo;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  value: string;
}

export class Transaction {
  @ApiProperty()
  hash: string;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  blockNumber: number;

  @ApiProperty()
  timestamp: number;

  @ApiProperty({ required: false, type: TokenInfo })
  token?: TokenInfo;

  @ApiProperty({ required: false, type: [TokenTransfer] })
  tokenTransfers?: TokenTransfer[];
}

export class TransactionResponse {
  @ApiProperty({ type: [Transaction] })
  data: Transaction[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

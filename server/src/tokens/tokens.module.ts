import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [TokensController],
  providers: [TokensService, ConfigService],
})
export class TokensModule {
  
}

import { Module } from '@nestjs/common';
import { PriceService } from './price.service';

@Module({})
export class PriceModule {
  exports: [PriceService];
  providers: [PriceService];
}

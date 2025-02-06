import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { PriceService } from './price/price.service';
import configuration from './config/configuration';
import { TransactionsModule } from './transactions/transactions.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    AuthModule,
    TransactionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User],
      synchronize: process.env.NODE_ENV !== 'production',
    }),

    TokensModule,
  ],
  controllers: [],
  providers: [
    Reflector,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    PriceService,
  ],
})
export class AppModule {}

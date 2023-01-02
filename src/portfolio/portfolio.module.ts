import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils/forward-ref.util';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { CoreModule } from '../core/core.module';
import { PortfolioController } from './portfolio.controller';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';
import { Position, PositionSchema } from './schemas/position.schema';
import { PortfolioService } from './services/portfolio.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: Position.name, schema: PositionSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CoreModule,
    forwardRef(() => UserModule),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}

import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from 'src/core/core.module';
import { FinnhubService } from 'src/core/services/finnhub.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { PortfolioController } from './portfolio.controller';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';
import { Position, PositionSchema } from './schemas/position.schema';
import { PortfolioService } from './services/portfolio.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: Position.name, schema: PositionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CoreModule,
    HttpModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, UserService, FinnhubService],
})
export class PortfolioModule {}

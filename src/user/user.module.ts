import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PortfolioService } from 'src/portfolio/services/portfolio.service';
import { PortfolioModule } from 'src/portfolio/portfolio.module';
import {
  Portfolio,
  PortfolioSchema,
} from 'src/portfolio/schemas/portfolio.schema';
import {
  Position,
  PositionSchema,
} from 'src/portfolio/schemas/position.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: Position.name, schema: PositionSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
      }),
      inject: [ConfigService],
    }),
    PortfolioModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, PortfolioService],
  exports: [UserService],
})
export class UserModule {}

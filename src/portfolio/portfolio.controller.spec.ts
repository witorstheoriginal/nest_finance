import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '../core/core.module';
import { FinnhubService } from '../core/services/finnhub.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { CurrentUserEntity } from '../user/types';
import { UserService } from '../user/user.service';
import { createMongoTestModule } from '../../test/mongo-test-module';
import { PortfolioController } from './portfolio.controller';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';
import { Position, PositionSchema } from './schemas/position.schema';
import { PortfolioService } from './services/portfolio.service';
import { ConfigService } from '@nestjs/config';

const user: CurrentUserEntity = {
  sub: '63a1755deffc5562a687d589',
  email: 'dooku@yahoo.it',
};

describe('PortfolioController', () => {
  const { module: mongoTestModule, closeConnection } = createMongoTestModule();
  let portfolioController: PortfolioController;

  const createSampleData = () =>
    portfolioController.create(
      {
        name: 'test 1',
      },
      user,
    );

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        mongoTestModule,
        MongooseModule.forFeature([
          { name: Portfolio.name, schema: PortfolioSchema },
          { name: Position.name, schema: PositionSchema },
          { name: User.name, schema: UserSchema },
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        HttpModule,
        CoreModule,
      ],
      controllers: [PortfolioController],
      providers: [PortfolioService, UserService, FinnhubService, ConfigService],
    }).compile();

    portfolioController = app.get<PortfolioController>(PortfolioController);
  });

  afterEach(closeConnection);

  describe('/', () => {
    it('should create a new portfolio', async () => {
      const res = await createSampleData();

      expect(res?.name).toBe('test 1');
    });
  });

  describe('/:id', () => {
    it('should get the portfolio with the given id', async () => {
      const sampleData = await createSampleData();
      const res = await portfolioController.findById(
        {
          id: sampleData!._id.toString(),
        },
        user,
      );

      expect(res?.name).toBe('test 1');
    });

    it("should update an existing portfolio's data using the id", async () => {
      const sampleData = await createSampleData();
      const res = await portfolioController.updateById(
        { id: sampleData!._id.toString() },
        {
          name: 'test 2',
        },
        user,
      );

      expect(res?.name).toBe('test 2');
    });

    it('should delete the portfolio with the given id', async () => {
      const sampleData = await createSampleData();
      await portfolioController.deleteById(
        {
          id: sampleData!._id.toString(),
        },
        user,
      );
      const res = await portfolioController.findById(
        {
          id: sampleData!._id.toString(),
        },
        user,
      );
      expect(res).toBe(null);
    });
  });

  describe('/:id/positions/open', () => {
    it('should create a position with the data in the schema', async () => {
      const sampleData = await createSampleData();
      const res = await portfolioController.openPosition(
        {
          quantity: 5,
          portfolioId: sampleData!._id.toString(),
          symbol: 'AAPL',
          type: 'buy',
        },
        user,
      );

      expect(res?.quantity).toBe(5);
      expect(res?.portfolioId).toBe(sampleData!._id.toString());
      expect(res?.symbol).toEqual('AAPL');
      expect(res?.type).toEqual('buy');
    });
  });

  describe('/:id/positions/close', () => {
    it('should close a position storing data in "opening" property', async () => {
      const sampleData = await createSampleData();
      const res1 = await portfolioController.openPosition(
        {
          quantity: 5,
          portfolioId: sampleData!._id.toString(),
          symbol: 'AAPL',
          type: 'buy',
        },
        user,
      );
      const res = await portfolioController.closePosition(
        {
          id: res1._id.toString(),
        },
        user,
      );

      expect(res?.quantity).toBe(5);
      expect(res?.portfolioId).toBe(sampleData!._id.toString());
      expect(res?.symbol).toEqual('AAPL');
      expect(res?.type).toEqual('buy');
      expect(res?.opening).toEqual({
        price: res1.price,
        quantity: 5,
        date: res1.date,
      });
    });
  });
});

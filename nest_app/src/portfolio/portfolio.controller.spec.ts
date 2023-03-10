import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '../core/core.module';
import { CurrentUserEntity } from '../user/types';
import { createMongoTestModule } from '../../test/mongo-test-module';
import { PortfolioController } from './portfolio.controller';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';
import {
  Position,
  PositionSchema,
  PositionType,
  StatusType,
} from './schemas/position.schema';
import { PortfolioService } from './services/portfolio.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import configuration from '../configuration';
import { UserService } from '../user/user.service';

const user: CurrentUserEntity = {
  sub: '63a1755deffc5562a687d589',
  email: 'dooku@yahoo.it',
};

describe('PortfolioController', () => {
  const { module: mongoTestModule, closeConnection } = createMongoTestModule();
  let portfolioController: PortfolioController;

  const createSampleData = () =>
    portfolioController.create({ name: 'test 1' }, user);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        mongoTestModule,
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        MongooseModule.forFeature([
          { name: Portfolio.name, schema: PortfolioSchema },
          { name: Position.name, schema: PositionSchema },
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        CoreModule,
        UserModule,
      ],
      controllers: [PortfolioController],
      providers: [PortfolioService],
    }).compile();

    portfolioController = app.get<PortfolioController>(PortfolioController);
    const userService = app.get<UserService>(UserService);
    await userService.initUser(user.sub, user.email, 10000);
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

  describe('/positions/open', () => {
    it('should create a position with the data in the schema', async () => {
      const sampleData = await createSampleData();
      const [, res] = await portfolioController.openPosition(
        {
          quantity: 5,
          portfolioId: sampleData!._id.toString(),
          symbol: 'AAPL',
          type: PositionType.Buy,
        },
        user,
      );
      expect(res?.quantity).toBe(5);
      expect(res?.portfolioId).toEqual(sampleData!._id);
      expect(res?.symbol).toEqual('AAPL');
      expect(res?.status).toEqual(StatusType.Open);
      expect(res?.type).toEqual(PositionType.Buy);
    });
  });

  describe('/positions/close', () => {
    it('should close a position storing data in "opening" property', async () => {
      const sampleData = await createSampleData();
      const [_, res1] = await portfolioController.openPosition(
        {
          quantity: 5,
          portfolioId: sampleData!._id.toString(),
          symbol: 'AAPL',
          type: PositionType.Buy,
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
      expect(res?.portfolioId).toEqual(sampleData!._id);
      expect(res?.symbol).toEqual('AAPL');
      expect(res?.type).toEqual(PositionType.Buy);
      expect(res?.status).toEqual(StatusType.Close);
      expect(res?.opening).toEqual({
        price: res1.price,
        quantity: 5,
        date: res1.date,
      });
    });
  });
});

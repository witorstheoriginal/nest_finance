import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUserEntity } from 'src/user/types';
import { createMongoTestModule } from '../../test/mongo-test-module';
import { Watchlist, WatchlistSchema } from './schemas/watchlist.schema';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

type SampleDataConfig = { symbols: string[] };

describe('WatchlistController', () => {
  const { module: mongoTestModule, closeConnection } = createMongoTestModule();
  let watchlistController: WatchlistController;
  const user: CurrentUserEntity = {
    sub: '63a1755deffc5562a687d589',
    email: 'dooku@yahoo.it',
  };
  const createSampleData = (config?: SampleDataConfig) =>
    watchlistController.create(
      {
        name: 'test1',
        description: 'description1',
        symbols: config?.symbols || ['A', 'B'],
      },
      user,
    );

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        mongoTestModule,
        MongooseModule.forFeature([
          { name: Watchlist.name, schema: WatchlistSchema },
        ]),
      ],
      controllers: [WatchlistController],
      providers: [WatchlistService],
    }).compile();

    watchlistController = app.get<WatchlistController>(WatchlistController);
  });

  afterEach(closeConnection);

  describe('/', () => {
    it('should create a new watchlist', async () => {
      const res = await createSampleData();

      expect(res?.name).toBe('test1');
      expect(res?.description).toBe('description1');
      expect(res?.symbols).toEqual(['A', 'B']);
    });

    it('should create unique symbols', async () => {
      const res = await createSampleData({ symbols: ['A', 'A', 'A', 'B'] });

      expect(res?.symbols).toEqual(['A', 'B']);
    });
  });

  describe('/:id', () => {
    it('should get the watchlist with the given id', async () => {
      const sampleData = await createSampleData();
      const res = await watchlistController.findById(
        {
          id: sampleData!._id.toString(),
        },
        user,
      );

      expect(res?.name).toBe('test1');
      expect(res?.description).toBe('description1');
      expect(res?.symbols).toEqual(['A', 'B']);
    });

    it("should update an existing watchlist's data using the id", async () => {
      const sampleData = await createSampleData();
      const res = await watchlistController.updateById(
        { id: sampleData!._id.toString() },
        {
          name: 'test2',
          description: 'alternative description',
        },
        user,
      );

      expect(res?.name).toBe('test2');
      expect(res?.description).toBe('alternative description');
      expect(res?.symbols).toEqual(['A', 'B']);
    });

    it('should delete the watchlist with the given id', async () => {
      const sampleData = await createSampleData();
      await watchlistController.deleteById(
        {
          id: sampleData!._id.toString(),
        },
        user,
      );
      const res = await watchlistController.findById(
        {
          id: sampleData!._id.toString(),
        },
        user,
      );
      expect(res).toBe(null);
    });
  });

  describe('/:id/symbols', () => {
    it("should update watchlist's symbols given a dto with arrays of 'add' and 'remove' as properties", async () => {
      const sampleData = await createSampleData();
      const res = await watchlistController.updateSymbols(
        { id: sampleData!._id.toString() },
        { add: ['MON'], remove: ['A', 'B'] },
        user,
      );
      console.log(res);
      expect(res?.name).toBe('test1');
      expect(res?.description).toBe('description1');
      expect(res?.symbols).toEqual(['MON']);
    });
  });
});

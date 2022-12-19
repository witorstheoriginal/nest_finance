import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { createMongoTestModule } from '../../test/mongo-test-module';
import { Watchlist, WatchlistSchema } from './schemas/watchlist.schema';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

type SampleDataConfig = { symbols: string[] };

describe('WatchlistController', () => {
  const { module: mongoTestModule, closeConnection } = createMongoTestModule();
  let watchlistController: WatchlistController;

  const createSampleData = (config?: SampleDataConfig) =>
    watchlistController.create({
      name: 'test1',
      description: 'description1',
      symbols: config?.symbols || ['A', 'B'],
    });

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
});

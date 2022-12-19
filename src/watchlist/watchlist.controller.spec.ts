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

  describe('/:id', () => {
    it('should get the watchlist with the given id', async () => {
      const dataInTheDB = await createSampleData();
      const res = await watchlistController.findById({
        id: dataInTheDB!._id.toString(),
      });

      expect(res?.name).toBe('test1');
      expect(res?.description).toBe('description1');
      expect(res?.symbols).toEqual(['A', 'B']);
    });

    it("should update an existing watchlist's data using the id", async () => {
      const dataInTheDB = await createSampleData();
      const res = await watchlistController.updateById(
        { id: dataInTheDB!._id.toString() },
        {
          name: 'test2',
          description: 'alternative description',
        },
      );

      expect(res?.name).toBe('test2');
      expect(res?.description).toBe('alternative description');
      expect(res?.symbols).toEqual(['A', 'B']);
    });

    it('should delete the watchlist with the given id', async () => {
      const dataInTheDB = await createSampleData();
      await watchlistController.deleteById({
        id: dataInTheDB!._id.toString(),
      });
      const res = await watchlistController.findById({
        id: dataInTheDB!._id.toString(),
      });
      expect(res).toBe(null);
    });
  });

  describe.only('/:id/symbols', () => {
    it("should update watchlist's symbols given a dto with arrays of 'add' and 'remove' as properties", async () => {
      const dataInTheDB = await createSampleData();
      const res = await watchlistController.updateSymbols(
        { id: dataInTheDB!._id.toString() },
        { add: ['MON'], remove: ['A', 'B'] },
      );
      console.log(res);
      expect(res?.name).toBe('test1');
      expect(res?.description).toBe('description1');
      expect(res?.symbols).toEqual(['MON']);
    });
  });
});

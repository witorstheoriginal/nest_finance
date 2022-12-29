import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FinnhubService } from './services/finnhub.service';
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [FinnhubService],
})
export class CoreModule {}

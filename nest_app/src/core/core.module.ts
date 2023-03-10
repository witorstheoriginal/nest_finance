import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FinnhubService } from './services/finnhub.service';
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [FinnhubService, ConfigService],
  exports: [FinnhubService],
})
export class CoreModule {}

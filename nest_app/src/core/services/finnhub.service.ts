import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

type QuoteResponse = {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
};
@Injectable()
export class FinnhubService {
  constructor(
    private configService: ConfigService,
    private http: HttpService,
  ) {}

  async getStockPrice(symbol: string) {
    const baseUrl = this.configService.get<string>('finnhub.baseUrl');
    const apiKey = this.configService.get<string>('finnhub.apiKey');
    const request = this.http.get<QuoteResponse>(`${baseUrl}/quote`, {
      params: { symbol, token: apiKey },
    });
    const quote = await lastValueFrom(request);

    return quote.data.c;
  }
}

import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
//import { CreatePortfolioDto } from './dto/portfolio.dto';
import { Portfolio, PortfolioDocument } from 'src/portfolio/portfolio.schema';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>,
  ) {}

  /* async create(createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const createdPortfolio = new this.portfolioModel(createPortfolioDto);
    return createdPortfolio.save();
  } */

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioModel.find().exec();
  }
}
Connection;

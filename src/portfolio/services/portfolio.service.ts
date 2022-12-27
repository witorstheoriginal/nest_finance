import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
//import { CreatePortfolioDto } from './dto/portfolio.dto';
import {
  Portfolio,
  PortfolioDocument,
} from 'src/portfolio/schemas/portfolio.schema';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { OpenPositionDto } from '../dto/open-position.dto';
import { ClosePositionDto } from '../dto/close-position.dto';
import { PositionDocument } from '../schemas/position.schema';
import { UserDocument } from 'src/user/schemas/user.schema';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>,
    private positionModel: Model<PositionDocument>,
    private userModel: Model<UserDocument>,
  ) {}

  create(
    createPortfolioDto: CreatePortfolioDto,
    ownerId: string,
  ): Promise<PortfolioDocument | null> {
    const createdPortfolio = new this.portfolioModel({
      ...createPortfolioDto,
      ownerId,
    });

    return createdPortfolio.save();
  }

  findPortfolio(
    id: string,
    ownerId: string,
  ): Promise<PortfolioDocument | null> {
    return this.portfolioModel.findOne({ _id: id, ownerId }).exec();
  }

  findPosition(id: string, ownerId: string) {
    return this.positionModel.findOne({ _id: id, ownerId });
  }

  openPosition(params: {
    portfolioId: string;
    openPositionDto: OpenPositionDto;
    ownerId: string;
  }) {
    const portfolio = this.findPortfolio(params.portfolioId, params.ownerId);

    if (!portfolio) {
      throw new Error("Portfolio id passed doesn't belong to current user.");
    }

    return this.positionModel.create({
      ...params.openPositionDto,
      ownerId: params.ownerId,
      portfolioId: params.portfolioId,
    });
  }

  closePosition(params: {
    closePositionDto: ClosePositionDto;
    ownerId: string;
  }) {
    const position = this.findPosition(
      params.closePositionDto.id,
      params.ownerId,
    );

    if (!position) {
      throw new Error("Portfolio id passed doesn't belong to current user.");
    }

    return this.positionModel
      .deleteOne({ ...params.closePositionDto, ownerId: params.ownerId })
      .exec();
  }

  update(params: {
    id: string;
    updatePortfolioDto: UpdatePortfolioDto;
    ownerId: string;
  }): Promise<PortfolioDocument | null> {
    return this.portfolioModel
      .findOneAndUpdate(
        { _id: params.id, ownerId: params.ownerId },
        {
          name: params.updatePortfolioDto.name,
        },
        { new: true },
      )
      .exec();
  }

  delete(id: string, ownerId: string) {
    return this.portfolioModel.deleteOne({ _id: id, ownerId }).exec();
  }

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioModel.find().exec();
  }
}
Connection;

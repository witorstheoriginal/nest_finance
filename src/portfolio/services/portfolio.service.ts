import { Connection, Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Portfolio, PortfolioDocument } from '../schemas/portfolio.schema';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { OpenPositionDto } from '../dto/open-position.dto';
import { ClosePositionDto } from '../dto/close-position.dto';
import {
  Position,
  PositionDocument,
  StatusType,
} from '../schemas/position.schema';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>,
    @InjectModel(Position.name)
    private positionModel: Model<PositionDocument>,
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

  findPortfolio(id: string, ownerId: string) {
    return this.portfolioModel
      .findOne({ _id: id, ownerId })
      .populate({
        path: 'positions',
        select: '-__v  -ownerId',
      })
      .select({ __v: false, id: false });
  }

  findPosition(id: string, ownerId: string) {
    return this.positionModel.findOne({ _id: id, ownerId });
  }

  getDefaultPortfolio(ownerId: string) {
    return this.portfolioModel.findOne({ ownerId, name: 'Default' });
  }

  async openPosition(params: {
    openPositionDto: OpenPositionDto;
    ownerId: string;
    price: number;
  }) {
    const count = await this.portfolioModel.countDocuments({
      _id: params.openPositionDto.portfolioId,
      ownerId: params.ownerId,
    });
    const defaultPortfolio = await this.getDefaultPortfolio(params.ownerId);
    const portfolioId =
      count === 0 ? defaultPortfolio?._id : params.openPositionDto.portfolioId;

    return this.positionModel.create({
      ...params.openPositionDto,
      ownerId: params.ownerId,
      portfolioId,
      status: StatusType.Open,
      date: new Date().toString(),
      price: params.price,
    });
  }

  async closePosition(params: {
    closePositionDto: ClosePositionDto;
    ownerId: string;
    price: number;
    position: PositionDocument;
  }) {
    const { position } = params;

    position.opening = {
      price: position.price,
      quantity: position.quantity,
      date: position.date,
    };
    position.status = StatusType.Close;
    position.date = new Date().toString();
    position.price = params.price;

    await position.save();

    return position;
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

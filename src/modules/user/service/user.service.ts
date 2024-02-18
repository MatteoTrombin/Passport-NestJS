import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entity/user.schema';
import { Model } from 'mongoose';
import { UserAbstractService } from './user.abstract.service';

export class UserService extends UserAbstractService {
    
  constructor(@InjectModel(User.name) private userSchema: Model<User>) {
    super();
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userSchema.findOne({username: username});
  }

  async findById(id: string): Promise<User> {
    return await this.userSchema.findById(id);

  }

  async create(user: User): Promise<User> {
    return (await this.userSchema.create(user)).toObject();
  }
}
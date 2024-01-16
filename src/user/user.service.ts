import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    
  constructor(@InjectModel(User.name) private userSchema: Model<User>) {}

  async findByUsername(username: string): Promise<User> {
    return await this.userSchema.findOne({username: username});
  }

  async findById(id: string): Promise<User> {
    return await this.userSchema.findById(id);

  }

  async create(user: User): Promise<User> {
    return await this.userSchema.create(user);
  }
}
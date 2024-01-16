import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.schema';
import { UserService } from '../user/user.service';
import { UserIdentity } from 'src/user-identity/user-identity.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as generatePassword from 'password-generator';

export type AuthenticatedUser = User & { access_token: string };

@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(UserIdentity.name) private userIdentitySchema: Model<UserIdentity>,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const identity = await this.userIdentitySchema.findOne({ 'credentials.username': username });
    if (!identity) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    const match = await bcrypt.compare(password, identity.credentials.hashedPassword);

    if (!match) {
      throw new UnauthorizedException(`Invalid password for user with username ${username}`);
    }
    
    return identity.toObject().user;
  }

  async validateOAuthLogin(user: User, email: string): Promise<User> {
    const identity = await this.userIdentitySchema.findOne({ 'credentials.username': email });

    if (identity) {
      return identity.toObject().user;
    } else {
      const generatedPassword = generatePassword(30, false);
      const newUser = await this.register(user, { username: email, password: generatedPassword }, 'google');
      return newUser;
    }
  }
  async login(user: User): Promise<AuthenticatedUser> {
    return {
      ...user,
      access_token: await this.jwtService.signAsync(user)
    };
  }

  async register(user: User, credentials: { username: string; password: string }, provider: string = 'local'): Promise<User> {
    const existingIdentity = await this.userIdentitySchema.findOne({
      'credentials.username': credentials.username,
    });
    if (existingIdentity) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const newUser = await this.userService.create(user);

    await this.userIdentitySchema.create({
      provider: provider,
      user: newUser.id,
      credentials: {
        username: credentials.username,
        hashedPassword
      }
    });

    return newUser;
  }
}
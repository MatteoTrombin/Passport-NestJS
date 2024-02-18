import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserAbstractService, UserService } from '@modules/user';
import * as generatePassword from 'password-generator';
import { UserIdentityAbstractService } from '@modules/user-identity';

export type AuthenticatedUser = User & { access_token: string };

@Injectable()
export class AuthService {
  
  constructor(
    private userIdentityService: UserIdentityAbstractService,
    private userService: UserAbstractService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const identity = await this.userIdentityService.findByUsername(username);
    
    if(!identity) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const match = await bcrypt.compare(password, identity.credentials.hashedPassword);

    if (!match) {
      throw new UnauthorizedException(`Invalid password for user with username ${username}`);
    }
    
    return identity.user;
  }

  async validateOAuthLogin(user: User, email: string): Promise<User> {
    const identity = await this.userIdentityService.findByUsername(email);

    if (identity) {
      return identity.user;
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
    const existingIdentity = await this.userIdentityService.findByUsername(credentials.username);
    if (existingIdentity) {
       throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const newUser = await this.userService.create(user);

    await this.userIdentityService.create({
      provider: provider,
      user: newUser,
      credentials: {
        username: credentials.username,
        hashedPassword
      }
    });

    return newUser;
  }
}
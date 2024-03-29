import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { pick } from 'lodash';
import { User, UserAbstractService } from '@modules/user';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@modules/user';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(private userService: UserAbstractService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}


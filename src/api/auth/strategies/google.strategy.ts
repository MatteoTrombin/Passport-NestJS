import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '@modules/user';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService, configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLEAUTH_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLEAUTH_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/api/google-redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos } = profile;

      const userPayload: User = {
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value
      };

      const user = await this.authService.validateOAuthLogin(userPayload, emails[0].value);

      done(null, user);
    } catch (error) {
      done(new UnauthorizedException('Failed to authenticate with Google. Please try again.'), null);
    }
  }
}

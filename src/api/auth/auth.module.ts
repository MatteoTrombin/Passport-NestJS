import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@modules/user';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@api/auth/strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@api/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { UserIdentityModule } from '@modules/user-identity';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UserModule, 
    UserIdentityModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: "7d" }
      }),
      inject: [ConfigService]
    }),
    PassportModule.register({session: true})
  ],
  providers: [
    AuthService, 
    LocalStrategy,
    GoogleStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}

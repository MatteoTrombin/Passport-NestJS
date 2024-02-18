import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAbstractService, UserModule, UserService } from '@modules/user';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config'; 
import { AuthModule } from '@api/auth/auth.module';
import { UserIdentityAbstractService, UserIdentityModule, UserIdentityService } from '@modules/user-identity';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    UserModule.forRoot([
      {provide: UserAbstractService, useClass: UserService}
    ]),
    UserIdentityModule.forRoot([
      {provide: UserIdentityAbstractService, useClass: UserIdentityService}
    ]),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/auth-test'),
    UserIdentityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

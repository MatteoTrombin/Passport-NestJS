import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserIdentityModule } from './user-identity/user-identity.module';
import { ConfigModule } from '@nestjs/config'; 
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    UserModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/auth-test'),
    UserIdentityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

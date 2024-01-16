import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserIdentity, UserIdentitySchema } from './user-identity.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: UserIdentity.name, schema: UserIdentitySchema }])],
    exports: [MongooseModule]
})
export class UserIdentityModule {}

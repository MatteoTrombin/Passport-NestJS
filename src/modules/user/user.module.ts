import { DynamicModule, Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserAbstractService } from "./service/user.abstract.service";
import { User, UserSchema } from "./entity/user.schema";

@Module({})
export class UserModule {
  static forRoot(providers: Provider[], global = true): DynamicModule {
    return {
      global,
      module: UserModule,
      imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
      ],
      providers: [
        ...providers
      ],
      exports: [UserAbstractService]
    }
  }
}
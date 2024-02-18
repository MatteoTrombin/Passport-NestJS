import { DynamicModule, Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserIdentity, UserIdentitySchema } from "./entity/user-identity.schema";
import { UserIdentityAbstractService } from "./service/user-identity.abstract.service";

@Module({})
export class UserIdentityModule {
  static forRoot(providers: Provider[], global = true): DynamicModule {
    return {
      global,
      module: UserIdentityModule,
      imports: [
        MongooseModule.forFeature([{name: UserIdentity.name, schema: UserIdentitySchema}])
      ],
      providers: [
        ...providers
      ],
      exports: [UserIdentityAbstractService]
    }
  }
}
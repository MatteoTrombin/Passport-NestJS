import { Injectable } from "@nestjs/common";
import { UserIdentity } from "../entity/user-identity.schema";

@Injectable()
export abstract class UserIdentityAbstractService {
  abstract findByUsername(username: string): Promise<UserIdentity>;
  abstract create(userIdentity: UserIdentity): Promise<UserIdentity>;
}
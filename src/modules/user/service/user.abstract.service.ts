import { Injectable } from "@nestjs/common";
import { User } from "../entity/user.schema";

@Injectable()
export abstract class UserAbstractService {
  abstract findByUsername(username: string): Promise<User>;
  abstract findById(id: string): Promise<User>;
  abstract create(user: User): Promise<User>;
}
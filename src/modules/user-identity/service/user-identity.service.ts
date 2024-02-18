import { InjectModel } from "@nestjs/mongoose";
import { UserIdentity } from "../entity/user-identity.schema";
import { UserIdentityAbstractService } from "./user-identity.abstract.service";
import { Model } from "mongoose";
import { NotFoundException } from "@nestjs/common";

export class UserIdentityService extends UserIdentityAbstractService {
    constructor(
        @InjectModel(UserIdentity.name) private userIdentitySchema: Model<UserIdentity>
    ) {
        super();
    }

    async findByUsername(username: string): Promise<UserIdentity> {
        const identity =  await this.userIdentitySchema.findOne({ 'credentials.username': username });

        if (identity) {
            return identity.toObject();
        } else {
            return identity;
        }
    }
    
    async create(userIdentity: UserIdentity): Promise<UserIdentity> {
        return await this.userIdentitySchema.create(userIdentity);
    }
}
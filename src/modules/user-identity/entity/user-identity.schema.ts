import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '@modules/user';
import { Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        transform: function (doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
        }
    }
})
export class UserIdentity {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ type: Object })
    credentials: {
        username: string;
        hashedPassword: string;
    };

    @Prop({ default: 'local' })
    provider: string;
}

export const UserIdentitySchema = SchemaFactory.createForClass(UserIdentity);


UserIdentitySchema.pre('findOne', function (next) {
    this.populate('user');
    next();
});
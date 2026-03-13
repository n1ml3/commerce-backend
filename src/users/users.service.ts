import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findOneByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(userData: Partial<User>): Promise<UserDocument> {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async update(id: string, updateData: Partial<User>): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async remove(id: string): Promise<UserDocument | null> {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}

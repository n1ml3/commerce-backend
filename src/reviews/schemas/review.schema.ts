import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    product: Product;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop()
    comment?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

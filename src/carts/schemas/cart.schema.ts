import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';

export type CartDocument = Cart & Document;

@Schema()
export class CartItem {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    product: Product;

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true })
    price: number;
}

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    user: User;

    @Prop({ type: [CartItem], default: [] })
    items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

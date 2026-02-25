import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User, Address } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

@Schema()
export class OrderItem {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    product: Product;

    @Prop({ required: true })
    name: string; // Snapshot name at the time of order

    @Prop({ required: true })
    price: number; // Snapshot price at the time of order

    @Prop({ required: true, min: 1 })
    quantity: number;
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: Address, required: true })
    shippingAddress: Address; // Snapshot of the shipping address

    @Prop({ type: [OrderItem], required: true, minlength: 1 })
    items: OrderItem[];

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true })
    paymentMethod: string;

    @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    orderStatus: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

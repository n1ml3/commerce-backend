import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, PaymentStatus, OrderStatus } from './schemas/order.schema';
import { CartsService } from '../carts/carts.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private cartsService: CartsService,
    ) { }

    async checkout(userId: string, shippingAddress: any, paymentMethod: string): Promise<Order> {
        const cart = await this.cartsService.getCart(userId);
        if (!cart.items || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty. Cannot proceed to checkout.');
        }

        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            const productDoc = item.product as any;
            const price = item.price || productDoc.originalPrice;
            totalAmount += price * item.quantity;
            return {
                product: productDoc._id,
                name: productDoc.name,
                price: price,
                quantity: item.quantity,
            };
        });

        const newOrder = await this.orderModel.create({
            user: userId,
            shippingAddress: shippingAddress || { street: 'Default St', city: 'City', country: 'Country', postalCode: '00000' },
            items: orderItems,
            totalAmount,
            paymentMethod: paymentMethod || 'COD',
            paymentStatus: PaymentStatus.PENDING,
            orderStatus: OrderStatus.PENDING,
        });

        await this.cartsService.clearCart(userId);

        return newOrder;
    }

    async getUserOrders(userId: string): Promise<Order[]> {
        return this.orderModel.find({ user: userId as any }).sort({ createdAt: -1 }).exec();
    }
}

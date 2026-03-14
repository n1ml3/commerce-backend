import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartsModule } from '../carts/carts.module';
import { ProductSchema } from '../products/schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
            { name: 'Product', schema: ProductSchema }
        ]),
        CartsModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule { }

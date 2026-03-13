import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartsModule } from '../carts/carts.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
        CartsModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule { }

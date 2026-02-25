import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])],
    controllers: [],
    providers: [],
})
export class CartsModule { }

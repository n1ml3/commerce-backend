import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [
        ProductsModule,
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])
    ],
    controllers: [CartsController],
    providers: [CartsService],
})
export class CartsModule { }

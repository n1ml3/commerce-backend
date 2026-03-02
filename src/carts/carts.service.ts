import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class CartsService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }

    async getCart(userId: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ user: userId as any }).populate('items.product').exec();
        if (!cart) {
            cart = await this.cartModel.create({ user: userId as any, items: [] });
        }
        return cart;
    }

    async addItem(userId: string, productId: string, quantity: number): Promise<Cart> {
        const rootCart = await this.cartModel.findOne({ user: userId as any });
        let cart = rootCart;
        if (!cart) {
            cart = await this.cartModel.create({ user: userId as any, items: [] });
        }

        const product = await this.productModel.findById(productId);
        if (!product) throw new NotFoundException('Product not found');

        const price = product.finalPrice || product.originalPrice;

        // Check if item already in cart
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: product as any,
                quantity,
                price
            });
        }

        await cart.save();
        return this.getCart(userId); // Return populated
    }

    async removeItem(userId: string, productId: string): Promise<Cart> {
        await this.cartModel.updateOne(
            { user: userId as any },
            { $pull: { items: { product: productId as any } } }
        );
        return this.getCart(userId);
    }

    async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
        await this.cartModel.updateOne(
            {
                user: userId as any,
                'items.product': productId as any
            },
            { $set: { 'items.$.quantity': quantity } }
        );
        return this.getCart(userId);
    }
}

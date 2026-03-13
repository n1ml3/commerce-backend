import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Category } from '../categories/schemas/category.schema';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }

    async findAll(categoryId?: string, vendorId?: string, search?: string): Promise<Product[]> {
        const query: any = {};
        if (categoryId) query.category = new Types.ObjectId(categoryId);
        if (vendorId) query.vendor = new Types.ObjectId(vendorId);
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        return this.productModel.find(query).exec();
    }

    async findById(id: string): Promise<ProductDocument | null> {
        return this.productModel.findById(id).populate('vendor', 'name shopName shopDescription email').exec();
    }

    async create(productData: Partial<Product>): Promise<ProductDocument> {
        const newProduct = new this.productModel(productData);
        return newProduct.save();
    }

    async update(id: string, updateData: Partial<Product>): Promise<ProductDocument | null> {
        return this.productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async remove(id: string): Promise<ProductDocument | null> {
        return this.productModel.findByIdAndDelete(id).exec();
    }

    async likeProduct(productId: string, userId: string): Promise<ProductDocument | null> {
        const product = await this.productModel.findById(productId);
        if (!product) return null;

        const userObjectId = new Types.ObjectId(userId) as any;
        const likedIndex = product.likes.indexOf(userObjectId);
        const dislikedIndex = product.dislikes.indexOf(userObjectId);

        if (likedIndex > -1) {
            product.likes.splice(likedIndex, 1);
        } else {
            product.likes.push(userObjectId);
            if (dislikedIndex > -1) product.dislikes.splice(dislikedIndex, 1);
        }
        return product.save();
    }

    async dislikeProduct(productId: string, userId: string): Promise<ProductDocument | null> {
        const product = await this.productModel.findById(productId);
        if (!product) return null;

        const userObjectId = new Types.ObjectId(userId) as any;
        const likedIndex = product.likes.indexOf(userObjectId);
        const dislikedIndex = product.dislikes.indexOf(userObjectId);

        if (dislikedIndex > -1) {
            product.dislikes.splice(dislikedIndex, 1);
        } else {
            product.dislikes.push(userObjectId);
            if (likedIndex > -1) product.likes.splice(likedIndex, 1);
        }
        return product.save();
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }

    async findAll(categoryId?: string): Promise<Product[]> {
        if (categoryId) {
            return this.productModel.find({ category: categoryId as any }).exec();
        }
        return this.productModel.find().exec();
    }
}

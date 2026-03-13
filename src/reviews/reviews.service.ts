import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>
    ) { }

    async findByProduct(productId: string): Promise<Review[]> {
        return this.reviewModel.find({ product: new Types.ObjectId(productId) as unknown as Product })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .exec();
    }

    async create(userId: string, productId: string, rating: number, comment?: string): Promise<ReviewDocument> {
        const newReview = new this.reviewModel({
            user: new Types.ObjectId(userId),
            product: new Types.ObjectId(productId),
            rating,
            comment
        });
        await newReview.save();

        const allReviews = await this.reviewModel.find({ product: new Types.ObjectId(productId) as unknown as Product });
        const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await this.productModel.findByIdAndUpdate(productId, { averageRating: avg });

        return newReview;
    }

    async remove(id: string): Promise<ReviewDocument | null> {
        return this.reviewModel.findByIdAndDelete(id).exec();
    }
}

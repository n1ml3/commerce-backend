import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    originalPrice: number;

    @Prop()
    finalPrice?: number;

    @Prop({ required: true, default: 0 })
    stockQuantity: number;

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    category: Category;

    @Prop({ type: [String], default: [] })
    images: string[];

    // This allows storing arbitrary attributes (e.g., color, size)
    @Prop({ type: Map, of: String })
    attributes?: Map<string, string>;

    @Prop({ default: 0 })
    averageRating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

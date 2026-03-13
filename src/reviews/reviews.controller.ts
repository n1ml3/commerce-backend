import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    async findByProduct(@Query('productId') productId: string) {
        return this.reviewsService.findByProduct(productId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() body: any, @Request() req: any) {
        const userId = req.user.sub || req.user._id || req.user.id;
        return this.reviewsService.create(userId, body.productId, body.rating, body.comment);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        return this.reviewsService.remove(id);
    }
}

import { Controller, Get, Query, Param, Post, Body, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async findAll(
        @Query('category') categoryId?: string,
        @Query('vendor') vendorId?: string,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAll(categoryId, vendorId, search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.findById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() productData: any) {
        return this.productsService.create(productData);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateData: any) {
        return this.productsService.update(id, updateData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }

    @Post(':id/like')
    @UseGuards(JwtAuthGuard)
    async likeProduct(@Param('id') id: string, @Request() req: any) {
        // Assume req.user has sub (which is the user ID)
        const userId = req.user.sub || req.user._id || req.user.id;
        return this.productsService.likeProduct(id, userId);
    }

    @Post(':id/dislike')
    @UseGuards(JwtAuthGuard)
    async dislikeProduct(@Param('id') id: string, @Request() req: any) {
        const userId = req.user.sub || req.user._id || req.user.id;
        return this.productsService.dislikeProduct(id, userId);
    }
}

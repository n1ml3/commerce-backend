import { Controller, Get, Post, Delete, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Get()
    async getCart(@Request() req) {
        return this.cartsService.getCart(req.user.sub);
    }

    @Post('items')
    async addItem(@Request() req, @Body() body: { productId: string; quantity: number }) {
        return this.cartsService.addItem(req.user.sub, body.productId, body.quantity || 1);
    }

    @Delete('items/:productId')
    async removeItem(@Request() req, @Param('productId') productId: string) {
        return this.cartsService.removeItem(req.user.sub, productId);
    }

    @Put('items/:productId')
    async updateQuantity(@Request() req, @Param('productId') productId: string, @Body() body: { quantity: number }) {
        return this.cartsService.updateItemQuantity(req.user.sub, productId, body.quantity);
    }
}

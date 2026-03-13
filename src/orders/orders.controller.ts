import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('checkout')
    async checkout(@Request() req, @Body() body: { shippingAddress?: any, paymentMethod?: string }) {
        return this.ordersService.checkout(req.user.sub, body.shippingAddress, body.paymentMethod || 'COD');
    }

    @Get()
    async getMyOrders(@Request() req) {
        return this.ordersService.getUserOrders(req.user.sub);
    }
}

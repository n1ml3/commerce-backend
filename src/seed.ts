import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';

import { User, UserRole } from './users/schemas/user.schema';
import { Product } from './products/schemas/product.schema';
import { Category } from './categories/schemas/category.schema';
import { Order, PaymentStatus, OrderStatus } from './orders/schemas/order.schema';
import { Review } from './reviews/schemas/review.schema';
import { Cart } from './carts/schemas/cart.schema';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userModel = app.get<Model<User>>(getModelToken(User.name));
    const productModel = app.get<Model<Product>>(getModelToken(Product.name));
    const categoryModel = app.get<Model<Category>>(getModelToken(Category.name));
    const orderModel = app.get<Model<Order>>(getModelToken(Order.name));
    const reviewModel = app.get<Model<Review>>(getModelToken(Review.name));
    const cartModel = app.get<Model<Cart>>(getModelToken(Cart.name));

    console.log('Cleaning up old DB...');
    await orderModel.deleteMany({});
    await cartModel.deleteMany({});
    await reviewModel.deleteMany({});
    await productModel.deleteMany({});
    await categoryModel.deleteMany({});
    await userModel.deleteMany({});

    console.log('Generating dummy data...');

    // 1. Seed Categories
    console.log('--- Seeding Categories ---');
    const categories: any[] = [];
    const categoryDocList: any[] = []; // to link products
    for (let i = 0; i < 5; i++) {
        const catName = faker.commerce.department();
        const catSlug = faker.helpers.slugify(catName).toLowerCase() + '-' + faker.string.alphanumeric(4);
        const catData = {
            name: catName,
            slug: catSlug,
            description: faker.commerce.productDescription(),
        };
        categories.push(catData);
    }
    const insertedCategories = await categoryModel.insertMany(categories);
    categoryDocList.push(...insertedCategories);
    console.log(`Inserted ${categoryDocList.length} Categories.`);


    // 2. Seed Users
    console.log('--- Seeding Users ---');
    const users: any[] = [];
    const userDocList: any[] = []; // to link carts, orders, reviews
    const saltRounds = 10;
    const defaultPasswordHash = await bcrypt.hash('password123', saltRounds);

    for (let i = 0; i < 20; i++) {
        const numAddresses = faker.number.int({ min: 1, max: 3 });
        const addresses: any[] = [];
        for (let j = 0; j < numAddresses; j++) {
            addresses.push({
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                zipCode: faker.location.zipCode(),
                country: faker.location.country()
            });
        }

        const userData = {
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            passwordHash: defaultPasswordHash,
            role: i === 0 ? UserRole.ADMIN : UserRole.USER, // proper enum
            phone: faker.phone.number(),
            addresses: addresses
        };
        users.push(userData);
    }
    const insertedUsers = await userModel.insertMany(users);
    userDocList.push(...insertedUsers);
    console.log(`Inserted ${userDocList.length} Users.`);


    // 3. Seed Products
    console.log('--- Seeding Products ---');
    const products: any[] = [];
    const productDocList: any[] = []; // to link carts, orders, reviews
    for (let i = 0; i < 50; i++) {
        const prodName = faker.commerce.productName();
        const prodSlug = faker.helpers.slugify(prodName).toLowerCase() + '-' + faker.string.alphanumeric(6);
        const originalPrice = parseFloat(faker.commerce.price({ min: 20, max: 1000 }));
        const randomCategory = faker.helpers.arrayElement(categoryDocList);

        const images: string[] = [];
        for (let j = 0; j < faker.number.int({ min: 1, max: 4 }); j++) {
            images.push(faker.image.urlPicsumPhotos());
        }

        // Add 1 or 2 attributes 
        const attrMap = new Map<string, string>();
        if (faker.datatype.boolean()) attrMap.set('Color', faker.color.human());
        if (faker.datatype.boolean()) attrMap.set('Material', faker.commerce.productMaterial());

        const prodData = {
            name: prodName,
            slug: prodSlug,
            description: faker.commerce.productDescription(),
            originalPrice: originalPrice,
            finalPrice: originalPrice * (faker.number.float({ min: 0.8, max: 1.0 })), // 0 - 20% discount
            stockQuantity: faker.number.int({ min: 0, max: 500 }),
            category: randomCategory._id,
            images: images,
            attributes: Object.fromEntries(attrMap),
            averageRating: 0 // Will be updated by reviews later theoretically, but we set 0 for now
        };
        products.push(prodData);
    }
    const insertedProducts = await productModel.insertMany(products);
    productDocList.push(...insertedProducts);
    console.log(`Inserted ${productDocList.length} Products.`);


    // 4. Seed Reviews (Randomly generated for products by users)
    console.log('--- Seeding Reviews ---');
    const reviews: any[] = [];
    for (let i = 0; i < 100; i++) {
        const randomUser = faker.helpers.arrayElement(userDocList);
        const randomProduct = faker.helpers.arrayElement(productDocList);

        const reviewData = {
            user: randomUser._id,
            product: randomProduct._id,
            rating: faker.number.int({ min: 1, max: 5 }),
            comment: faker.datatype.boolean() ? faker.lorem.sentences(2) : undefined
        };
        reviews.push(reviewData);
    }
    await reviewModel.insertMany(reviews);

    // Quick and dirty update of product average rating (not perfectly strict, just rough math)
    console.log('Updating Product average ratings based on dummy reviews...');
    for (const prod of productDocList) {
        const prodReviews = reviews.filter(r => r.product === prod._id);
        if (prodReviews.length > 0) {
            let sum = 0;
            for (let r of prodReviews) sum += r.rating;
            const avg = sum / prodReviews.length;
            await productModel.updateOne({ _id: prod._id }, { averageRating: parseFloat(avg.toFixed(1)) });
        }
    }
    console.log(`Inserted 100 Reviews.`);


    // 5. Seed Carts
    console.log('--- Seeding Carts ---');
    const carts: any[] = [];
    for (const usr of userDocList) {
        // Not all users have carts with items, 70% chance
        const cartItems: any[] = [];
        if (faker.datatype.boolean({ probability: 0.7 })) {
            const numItems = faker.number.int({ min: 1, max: 5 });
            for (let k = 0; k < numItems; k++) {
                const randomProd = faker.helpers.arrayElement(productDocList);
                cartItems.push({
                    product: randomProd._id,
                    quantity: faker.number.int({ min: 1, max: 3 }),
                    price: randomProd.finalPrice || randomProd.originalPrice
                });
            }
        }
        carts.push({
            user: usr._id,
            items: cartItems
        });
    }
    await cartModel.insertMany(carts);
    console.log(`Inserted ${carts.length} Carts.`);


    // 6. Seed Orders
    console.log('--- Seeding Orders ---');
    const orders: any[] = [];
    for (let i = 0; i < 30; i++) {
        const randomUser = faker.helpers.arrayElement(userDocList);
        if (randomUser.addresses.length === 0) continue; // Skip if no address

        const shippingAddress = faker.helpers.arrayElement(randomUser.addresses);

        const orderItems: any[] = [];
        let totalAmount = 0;
        const numItems = faker.number.int({ min: 1, max: 5 });

        for (let k = 0; k < numItems; k++) {
            const randomProd = faker.helpers.arrayElement(productDocList);
            const qty = faker.number.int({ min: 1, max: 4 });
            const priceToUse = randomProd.finalPrice || randomProd.originalPrice;

            orderItems.push({
                product: randomProd._id,
                name: randomProd.name,
                price: priceToUse,
                quantity: qty
            });
            totalAmount += priceToUse * qty;
        }

        const paymentMethod = faker.helpers.arrayElement(['CREDIT_CARD', 'PAYPAL', 'CASH_ON_DELIVERY']);
        const paymentStatus = faker.helpers.arrayElement([PaymentStatus.PENDING, PaymentStatus.PAID, PaymentStatus.FAILED]);
        const orderStatus = faker.helpers.arrayElement([OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED]);

        const orderData = {
            user: randomUser._id,
            shippingAddress: shippingAddress,
            items: orderItems,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            orderStatus: orderStatus
        };
        orders.push(orderData);
    }
    const insertedOrders = await orderModel.insertMany(orders);
    console.log(`Inserted ${insertedOrders.length} Orders.`);

    console.log('-----------------------------------');
    console.log('ALL DUMMY DATA SEEDED SUCCESSFULLY!');

    await app.close();
    process.exit(0);
}

bootstrap();

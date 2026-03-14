async function testCheckout() {
    try {
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.access_token;
        console.log('Login token:', token ? 'OK' : 'FAIL');

        // Select the product
        const productId = '69b3973a743989d8171c5f80';
        
        let productRes = await fetch(`http://localhost:3000/products/${productId}`);
        let productData = await productRes.json();
        console.log('Stock before checkout:', productData.stockQuantity);

        console.log('Adding product to cart...');
        await fetch(`http://localhost:3000/carts/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productId, quantity: 2 })
        });
        
        console.log('Checking out...');
        const checkoutRes = await fetch(`http://localhost:3000/orders/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ shippingAddress: { street: '123' }, paymentMethod: 'COD' })
        });
        console.log('Checkout STATUS:', checkoutRes.status);
        
        productRes = await fetch(`http://localhost:3000/products/${productId}`);
        productData = await productRes.json();
        console.log('Stock AFTER checkout:', productData.stockQuantity);

    } catch(e) {
        console.error('Error:', e);
    }
}
testCheckout();

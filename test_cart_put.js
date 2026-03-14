async function test() {
    try {
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.access_token;
        console.log('Login success');

        const cartRes = await fetch('http://localhost:3000/carts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const cartData = await cartRes.json();
        console.log('Cart Items count:', cartData.items?.length);
        
        if (cartData.items?.length > 0) {
            const productId = cartData.items[0].product._id || cartData.items[0].product;
            console.log('Trying to update quantity for product:', productId);
            const putRes = await fetch(`http://localhost:3000/carts/items/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ quantity: 2 })
            });
            const putData = await putRes.json();
            console.log('PUT:', putRes.status, JSON.stringify(putData, null, 2));
        } else {
             console.log('Cart is empty');
        }

    } catch(e) {
        console.error('Error:', e);
    }
}
test();

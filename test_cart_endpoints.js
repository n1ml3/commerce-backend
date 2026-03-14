async function test() {
    try {
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.access_token;
        console.log('Login token:', token ? 'OK' : 'FAIL');

        const productId = '69b3973a743989d8171c5f80';
        
        console.log('Adding product to cart...');
        await fetch(`http://localhost:3000/carts/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productId, quantity: 1 })
        });
        
        console.log('Fetching cart...');
        let cartRes = await fetch('http://localhost:3000/carts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        let cartData = await cartRes.json();
        console.log('Cart Items count:', cartData.items?.length, 'Quantity:', cartData.items?.[0]?.quantity);

        console.log('Trying to update quantity to 5...');
        const putRes = await fetch(`http://localhost:3000/carts/items/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ quantity: 5 })
        });
        const putData = await putRes.json();
        console.log('PUT STATUS:', putRes.status);
        console.log('Cart Items count after PUT:', putData.items?.length, 'Quantity:', putData.items?.[0]?.quantity);
        
        console.log('Trying to remove product...');
        const delRes = await fetch(`http://localhost:3000/carts/items/${productId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        const delData = await delRes.json();
        console.log('DELETE STATUS:', delRes.status);
        console.log('Cart Items count after DELETE:', delData.items?.length);

    } catch(e) {
        console.error('Error:', e);
    }
}
test();

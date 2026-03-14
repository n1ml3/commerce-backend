async function test() {
    try {
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.access_token;

        console.log('Fetching cart...');
        const cartRes = await fetch('http://localhost:3000/carts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const cartData = await cartRes.json();
        console.log('Cart:', JSON.stringify(cartData, null, 2));

    } catch(e) {
        console.error('Error:', e);
    }
}
test();

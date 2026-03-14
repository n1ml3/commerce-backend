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

        // ADD
        const addRes = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                name: 'Test Prod ' + Date.now(),
                slug: 'test-prod-' + Date.now(),
                description: 'test',
                originalPrice: 100,
                stockQuantity: 10,
                category: '69b3973a743989d8171c5f32', // assuming some ID
                vendor: '69b3973a743989d8171c5f2b' // assuming some vendor
            })
        });
        const addData = await addRes.json();
        console.log('ADD:', addRes.status, addData);

    } catch(e) {
        console.error('Error:', e);
    }
}
test();

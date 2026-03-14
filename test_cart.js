async function test() {
    try {
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        if(!loginRes.ok) throw new Error('Login failed: ' + JSON.stringify(loginData));
        const token = loginData.access_token;
        console.log('Login success');

        const productsRes = await fetch('http://localhost:3000/products');
        const productsData = await productsRes.json();
        if(!Array.isArray(productsData)) throw new Error('Products is not an array: ' + JSON.stringify(productsData));
        const p1 = productsData[0]._id;

        console.log('Adding product to cart...', p1);
        const addRes = await fetch('http://localhost:3000/carts/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productId: p1, quantity: 1 })
        });
        const addData = await addRes.json();
        console.log('Added:', addRes.status, typeof addData === 'object' ? addData.items : addData);

        console.log('Updating product in cart...');
        const updateRes = await fetch(`http://localhost:3000/carts/items/${p1}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ quantity: 2 })
        });
        const updateData = await updateRes.json();
        console.log('Updated:', updateRes.status, typeof updateData === 'object' ? updateData.items : updateData);

        console.log('Removing product from cart...');
        const removeRes = await fetch(`http://localhost:3000/carts/items/${p1}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        const removeData = await removeRes.json();
        console.log('Removed:', removeRes.status, typeof removeData === 'object' ? removeData.items : removeData);

    } catch(e) {
        console.error('Error:', e);
    }
}
test();

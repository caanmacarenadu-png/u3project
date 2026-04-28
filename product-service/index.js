const express = require('express');
const app = express();

app.use(express.json());

let products = [
 { id: 1, name: "Pizza", price: 100 },
 { id: 2, name: "Tacos", price: 50 }
];

app.get('/products', (req, res) => {
 res.json(products);
});

app.get('/products/:id', (req, res) => {
 const product = products.find(p => p.id == req.params.id);

 if (!product) {
   return res.status(404).json({ error: "Producto no encontrado" });
 }

 res.json(product);
});

app.listen(3001, () => {
 console.log("Product Service en puerto 3001");
});

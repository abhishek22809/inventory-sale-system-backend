const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let products = [
  { id: '1', name: 'Ring', price: 50, stock: 10 },
  { id: '2', name: 'Shoes', price: 30, stock: 20 }
];

app.get('/products', (req, res) => {
  res.json(products);
});

app.post('/purchase', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  product.stock += quantity;
  res.json({ message: 'Purchase successful', product });
});

app.post('/sales/checkout', (req, res) => {
  const { productId, quantity, discount = 10 } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (quantity > product.stock) return res.status(400).json({ error: 'Not enough stock' });

  const markedUpPrice = product.price * 1.2;
  console.log(markedUpPrice,product.price,'markedUpPrice');
  const discountedPrice = markedUpPrice * (1 - discount / 100);
  console.log(markedUpPrice * (1 - discount / 100),'discount');
  console.log(+(discountedPrice * quantity).toFixed(2),'finalTotal');
  const finalTotal = +(discountedPrice * quantity).toFixed(2);

  product.stock -= quantity;
  res.json({ finalTotal, updatedStock: product.stock });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
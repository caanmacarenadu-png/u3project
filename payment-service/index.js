const express = require('express');
const app = express();

app.use(express.json());

app.post('/pay', (req, res) => {
 const { amount } = req.body;

 if (!amount) {
   return res.status(400).json({ error: "Monto requerido" });
 }

 res.json({
   status: "success",
   message: "Pago procesado"
 });
});

app.listen(3002, () => {
 console.log("Payment Service en puerto 3002");
});

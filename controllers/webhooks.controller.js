export const paymentWebhook = async (req, res) => {
    try {
          //validate event
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  if (hash !== req.headers['x-paystack-signature']) {
    return res.sendStatus(400);
  }
  res.sendStatus(200);
  const event = req.body;
  console.log(event);
  // process webhook

    } catch (error) {
        
    }
}
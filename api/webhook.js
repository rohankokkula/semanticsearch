export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('Webhook received:', req.body);
      
      // Add timestamp to the webhook data
      const webhookData = {
        ...req.body,
        timestamp: new Date().toISOString(),
        received_at: new Date().toLocaleString()
      };
      
      // For now, just log the data
      // In a real implementation, you might want to store this in a database
      console.log('Processed webhook data:', webhookData);
      
      res.status(200).json({ 
        success: true, 
        message: 'Webhook received successfully',
        data: webhookData
      });
      
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error processing webhook',
        error: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

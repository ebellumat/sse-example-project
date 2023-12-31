import express from 'express';
import { CarRoute } from './carRoute';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const carRoute = new CarRoute();

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

app.get('/car-route-sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');

  const sendUpdate = () => {
    carRoute.updateRoute();
    const coordinates = carRoute.getCoordinates();
    res.write(`data: ${JSON.stringify({ coordinates })}\n\n`);
  };

  // Send initial data
  const initialData = JSON.stringify(carRoute.getCoordinates());
  res.write(`data: ${initialData}\n\n`);

  res.write(
    `data: ${JSON.stringify({ message: 'Connection Stablished' })}\n\n`
  );

  const intervalId = setInterval(sendUpdate, 500);

  // Cleanup on client disconnect
  req.on('close', () => {
    console.log('Closed by client');
    clearInterval(intervalId);
  });
});

import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

const app = express();

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SupportAI API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/tickets', ticketRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`SupportAI server running on port ${config.port}`);
});

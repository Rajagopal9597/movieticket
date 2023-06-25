// routes/ticketRoutes.ts

import express from 'express';
import * as ticketController from '../controllers/ticketController';
import { authenticate } from '../middleware/authenticationMiddleware';

const router = express.Router();

router.use(authenticate);

// Create  ticket
router.post('/tickets', ticketController.createTicket);

// Get  ticket by ID
router.get('/tickets/:id', ticketController.getTicketById);

// Update a ticket
router.put('/tickets/:id', ticketController.updateTicket);

// Delete a ticket
router.delete('/tickets/:id', ticketController.deleteTicket);

//Analytics
router.get('/tickets/analyze/earnings-by-month/:method',ticketController.analyzeEarningsByMonth)
router.get('/tickets/analyze/visits-by-month/:method',ticketController.analyzeVisitsByMonth)



export default router;

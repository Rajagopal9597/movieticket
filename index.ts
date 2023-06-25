import express from 'express';
import { authenticate } from './middleware/authenticationMiddleware';
import { errorHandling } from './middleware/errorHandlingMiddleware';
import * as ticketController from './controllers/ticketController';

const app = express();
import bodyParser from 'body-parser';



app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));



// Apply the authentication middleware globally
app.use(authenticate);

// Routes
app.post('/tickets', ticketController.createTicket);
app.get('/tickets/:id', ticketController.getTicketById);
app.put('/tickets/:id', ticketController.updateTicket);
app.delete('/tickets/:id', ticketController.deleteTicket);
app.get('/tickets/analyze/visits-by-month/:method',ticketController.analyzeVisitsByMonth);
app.get('/tickets/analyze/earnings-by-month/:method',ticketController.analyzeEarningsByMonth);

// Apply the error handling middleware
app.use(errorHandling);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

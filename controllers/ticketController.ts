
import { Request, Response } from 'express';
import * as ticketService from '../services/ticketServices';
import moment from 'moment';
import 'moment-timezone';
moment.tz.setDefault('Asia/Kolkata');




// Create a ticket
export const createTicket = async (req: Request, res: Response) => {
  try {
    const ticketData = req.body;
    ticketData.movieTime = moment.utc(ticketData.movieTime).format('YYYY-MM-DD HH:mm:ss')
   // const movieTime = moment('2023-06-23 10:00:00').utc().format('YYYY-MM-DD HH:mm:ss');
   //moment.utc('2023-06-23 04:30:00').format('YYYY-MM-DD HH:mm:ss');

    ticketData.creationDate = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
    const ticket = await ticketService.createTicket(ticketData);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create ticket' });
  }
};

// Get a ticket by ID
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;
    const ticket = await ticketService.getTicketById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get ticket' });
  }
};

// Update a ticket
export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;
    const ticketData = req.body;
    const updatedTicket = await ticketService.updateTicket(ticketId, ticketData);

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update ticket' });
  }
};

// Delete a ticket
export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;
    const deletedTicket = await ticketService.deleteTicket(ticketId);

    res.status(200).json({message:'Ticket deleted successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete ticket' });
  }
};



// Controller for analyzing movie earnings by month
export const analyzeEarningsByMonth = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;
    const {method} = req.params

    let result: { month: string; summaryProfit: number }[]; // Declare the type of result

    if (method === 'db-aggregation') {
      if (typeof startDate === 'string' && typeof endDate === 'string') {
        console.log("in db")
        result = await ticketService.analyzeEarningsByMonthDB(startDate, endDate);
      } else {
        throw new Error('Invalid date range');
      }
    } else {
      if (typeof startDate === 'string' && typeof endDate === 'string') {
        result = await ticketService.analyzeEarningsByMonthJS(startDate, endDate);
      } else {
        throw new Error('Invalid date range');
      }
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze earnings by month' });
  }
};

// Controller for analyzing movie visits by month

export const analyzeVisitsByMonth = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate} = req.body;
    const{ method } = req.params;
    console.log(startDate,endDate)
    let result: { month: string; summaryVisits: number }[]; // Declare the type of result
    
    if (method === 'db-aggregation') {
      if (typeof startDate === 'string' && typeof endDate === 'string') {
        console.log("inDB")
        result = await ticketService.analyzeVisitsByMonthDB(startDate, endDate);
      } else {
        throw new Error('Invalid date range');
      }
    } else {
      if (typeof startDate === 'string' && typeof endDate === 'string') {
        console.log("in js")
        result = await ticketService.analyzeVisitsByMonthJS(startDate, endDate);
      } else {
        throw new Error('Invalid date range');
      }
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to analyze movie visits by month' });
  }
};



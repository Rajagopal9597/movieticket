import moment from 'moment';
import 'moment-timezone';
moment.tz.setDefault('Asia/Kolkata');

import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432 // Default PostgreSQL port
});

pool
  .connect()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  });

interface Ticket {
  creationDate: string;
  customerName: string;
  movieTitle: string;
  movieTime: string;
  ticketPrice: number;
}
const createTicket = async (ticketData: Ticket) => {
  try {
    const {  creationDate, customerName, movieTitle, movieTime, ticketPrice } = ticketData;
    console.log(ticketData)
    //const currentTime = moment(); 
   // movieTime = moment(ticketData.movieTime).format('YYYY-MM-DD HH:mm:ss');


   // console.log(currentTime)
    const query = `
    INSERT INTO tickets (creation_date, customer_name, movie_title, movie_time, ticket_price)
    VALUES ( $1, $2, $3, $4,$5)
    RETURNING *
    `;

    const values = [ creationDate,customerName, movieTitle, movieTime, ticketPrice];
    //console.log(values)
    const result = await pool.query(query, values);
    

    const createdTicket = result.rows[0];
    createdTicket.creation_date = moment.utc(createdTicket.creation_date).local().format('YYYY-MM-DD HH:mm:ss');
    createdTicket.movie_time = moment.utc(createdTicket.movie_time).local().format('YYYY-MM-DD HH:mm:ss');
    return createdTicket;
  } catch (error) {
    throw new Error('Failed to create ticket');
  }
};

const getTicketById = async (ticketId: string) => {
  try {
    const query = `
      SELECT *
      FROM tickets
      WHERE id = $1
    `;

    const values = [ticketId];
    const result = await pool.query(query, values);

    const ticket = result.rows[0];
    ticket.creation_date = moment.utc(ticket.creation_date).local().format('YYYY-MM-DD HH:mm:ss');
    ticket.movie_time = moment.utc(ticket.movie_time).local().format('YYYY-MM-DD HH:mm:ss');
    return ticket;
  } catch (error) {
    throw new Error('Failed to get ticket');
  }
};

const updateTicket = async (ticketId: string, ticketData: Partial<Ticket>) => {
  try {
    const { customerName, movieTitle, movieTime, ticketPrice } = ticketData;
    //console.log(ticketData)
    const query = `
      UPDATE tickets
      SET customer_name = $1,
          movie_title = $2,
          movie_time = $3,
          ticket_price = $4
      WHERE id = $5
      RETURNING *
    `;

    const values = [customerName, movieTitle, movieTime, ticketPrice, ticketId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw new Error('Ticket not found');
    }
    result.rows[0].creation_date = moment.utc(result.rows[0].creation_date).local().format('YYYY-MM-DD HH:mm:ss');
    result.rows[0].movie_time = moment.utc(result.rows[0].movie_time).local().format('YYYY-MM-DD HH:mm:ss');
    const updatedTicket = result.rows[0];
    return updatedTicket;
  } catch (error) {
    throw new Error('Failed to update ticket');
  }
};

const deleteTicket = async (ticketId: string) => {
  try {
    const query = `
      DELETE FROM tickets
      WHERE id = $1
    `;

    const values = [ticketId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw new Error('Ticket not found');
    }
  } catch (error) {
    throw new Error('Failed to delete ticket');
  }
};

// Analyze movie earnings between 2 dates by month using DB aggregation
const analyzeEarningsByMonthDB = async (startDate: string, endDate: string) => {
  try {
    const query = `
      SELECT
        TO_CHAR(date_trunc('month', movie_time), 'Month') AS month,
        SUM(ticket_price) AS summaryProfit
      FROM
        tickets
      WHERE
        movie_time >= $1 AND movie_time <= $2
      GROUP BY
        month
      ORDER BY
        month;
    `;

    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  } catch (error) {
    throw new Error('Failed to analyze earnings by month (DB aggregation)');
  }
};

const analyzeEarningsByMonthJS = async (startDate: string, endDate: string) => {
  try {
    const query = `
      SELECT * FROM tickets WHERE movie_time >= $1 AND movie_time <= $2;
    `;
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    
    const tickets = await pool.query(query, [startDate, endDate]);
    console.log(tickets.rows)
    const earningsByMonth: Record<string, number> = {};
tickets.rows.forEach((ticket: any) => {
  const month = new Date(ticket.movie_time).getMonth();
  const monthName = monthNames[month];
  if (!earningsByMonth[monthName]) {
    earningsByMonth[monthName] = 0;
  }
  earningsByMonth[monthName] += Number(ticket.ticket_price); 
});

const result = Object.entries(earningsByMonth).map(([month, summaryProfit]) => ({
  month,
  summaryProfit,
}));


    return result;
  } catch (error) {
    throw new Error('Failed to analyze earnings by month');
  }
};

const analyzeVisitsByMonthJS = async (startDate: string, endDate: string) => {
  try {
    const query = `
    SELECT *
    FROM tickets
    WHERE DATE(movie_time) BETWEEN $1 AND $2;
    
    `;
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    
    const tickets = await pool.query(query, [startDate, endDate]);
    //console.log(tickets.rows)
    const visitsByMonth: Record<string, number> = {};
    tickets.rows.forEach((ticket: any) => {
      const month = new Date(ticket.movie_time).getMonth();
      const monthName = monthNames[month];
      if (!visitsByMonth[monthName]) {
        visitsByMonth[monthName] = 0;
      }
      visitsByMonth[monthName]++;
    });

    const result = Object.entries(visitsByMonth).map(([month, summaryVisits]) => ({
      month,
      summaryVisits,
    }));

    return result;
  } catch (error) {
    throw new Error('Failed to analyze visits by month');
  }
};

const analyzeVisitsByMonthDB = async (startDate: string, endDate: string) => {
  try {
    const query = `
      SELECT
        TO_CHAR(date_trunc('month', movie_time), 'Month') AS month,
        COUNT(*) AS summaryVisits
      FROM
        tickets
      WHERE
        movie_time >= $1 AND movie_time <= $2
      GROUP BY
        month
      ORDER BY
        month;
    `;
    console.log(query)
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  } catch (error) {
    throw new Error('Failed to analyze visits by month (DB aggregation)');
  }
};




export { createTicket, getTicketById, updateTicket, deleteTicket,analyzeEarningsByMonthDB, analyzeEarningsByMonthJS, analyzeVisitsByMonthJS, analyzeVisitsByMonthDB };
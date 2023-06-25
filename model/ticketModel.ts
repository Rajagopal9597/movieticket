// import { Pool } from 'pg';

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'root',
//   port: 5432 // Default PostgreSQL port
// });

// pool
//   .connect()
//   .then(() => {
//     console.log('Connected to database');
//   })
//   .catch((error) => {
//     console.error('Failed to connect to database:', error);
//   });

// interface Ticket {
//   id: string;
//   creationDate: Date;
//   customerName: string;
//   movieTitle: string;
//   movieTime: Date;
//   ticketPrice: number;
// }

// const createTicket = async (ticketData: Ticket) => {
//   try {
//     const { id, creationDate, customerName, movieTitle, movieTime, ticketPrice } = ticketData;

//     const query = `
//       INSERT INTO tickets (id, creation_date, customer_name, movie_title, movie_time, ticket_price)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING *
//     `;

//     const values = [id, creationDate, customerName, movieTitle, movieTime, ticketPrice];
//     const result = await pool.query(query, values);

//     const createdTicket = result.rows[0];
//     return createdTicket;
//   } catch (error) {
//     throw new Error('Failed to create ticket');
//   }
// };

// const getTicketById = async (ticketId: string) => {
//   try {
//     const query = `
//       SELECT *
//       FROM tickets
//       WHERE id = $1
//     `;

//     const values = [ticketId];
//     const result = await pool.query(query, values);

//     const ticket = result.rows[0];
//     return ticket;
//   } catch (error) {
//     throw new Error('Failed to get ticket');
//   }
// };

// const updateTicket = async (ticketId: string, ticketData: Partial<Ticket>) => {
//   try {
//     const { customerName, movieTitle, movieTime, ticketPrice } = ticketData;

//     const query = `
//       UPDATE tickets
//       SET customer_name = $1,
//           movie_title = $2,
//           movie_time = $3,
//           ticket_price = $4
//       WHERE id = $5
//       RETURNING *
//     `;

//     const values = [customerName, movieTitle, movieTime, ticketPrice, ticketId];
//     const result = await pool.query(query, values);

//     if (result.rowCount === 0) {
//       throw new Error('Ticket not found');
//     }

//     const updatedTicket = result.rows[0];
//     return updatedTicket;
//   } catch (error) {
//     throw new Error('Failed to update ticket');
//   }
// };

// const deleteTicket = async (ticketId: string) => {
//   try {
//     const query = `
//       DELETE FROM tickets
//       WHERE id = $1
//     `;

//     const values = [ticketId];
//     const result = await pool.query(query, values);

//     if (result.rowCount === 0) {
//       throw new Error('Ticket not found');
//     }
//   } catch (error) {
//     throw new Error('Failed to delete ticket');
//   }
// };

// export { createTicket, getTicketById, updateTicket, deleteTicket };

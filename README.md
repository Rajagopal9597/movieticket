# movieticket

Clone the app and install all the modules using the command npm install add a .env file and add your TOKEN after installing you may start the app using the command npx ts-node index.ts

# Database 
run this command to create the table
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  creation_date TIMESTAMP NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  movie_title VARCHAR(255) NOT NULL,
  movie_time TIMESTAMP NOT NULL
);

# API documentaion
i have attached the documentation in movieticketAPI file
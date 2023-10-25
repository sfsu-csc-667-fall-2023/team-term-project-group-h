Directions to set up database.

Download postgress.
Create a Database with createdb {name of db}.
Create an .env and use the command echo DATABASE_URL=postgres:/#`whoami`@localhost:5432/uno >> .env
When made go back to the .env and remove the # and rename the uno to the database you made.
Run the command npm run db:migrate to create a test table.
Once comleted. Go run npm run start:dev and vist the route localhost:3000/test to see if the database work.

Important Information about postgres.
Migrations would be used to create schemas of the table. Once we make changes we want to do db:migrate to save the changes.

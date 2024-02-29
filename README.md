# Tour Management System

Welcome to the Tour Management System, a web application built using Node.js and Express.js that allows users to book, edit, delete tours, and view booking history.
In this assignment, I developed a Tour Management System using Node.js and Express.js. The system allows users to book, edit, delete tours, and view booking history. It includes a MongoDB database for data storage and utilizes CRUD operations for managing tour information.
## Installation and Run Instructions

1. Clone the Repository:
    ```bash
    git clone https://github.com/Laura902l/Assignment3.git
    cd Assignment4


    ```
## Do not forget install method-override
2. Install Dependencies:
    ```bash
    npm install method-override
    npm install body-parser mongoose mongodb
    npm install
    npm install express-session
    npm install passport
    npm install passport-local-mongoose 
    ```

3. Run the Application:

    ```bash
    node server.js
    ```

    The application will run on http://localhost:3000.

## File Structure

The project has the following structure:

- `public`: Contains static files.
- `routes`: Handles route logic.
- `views`: Contains HTML templates.

## HTML Template

The HTML template (`home.ejs`) uses Bootstrap for a clean and responsive design. It includes a navigation bar for easy navigation and a footer displaying the group name.

## Express Server (server.js)

The server runs on the default port 3000. The logic for the travel agency is implemented in the `/travelagency` route, handling GET, POST, PUT, DELETE requests. Optionally, the code is organized by separating routes into a separate file (`routes/travelRoutes.js`).

## Technologies Used

- **Axios**: Used for making HTTP requests to the OpenWeatherMap API for weather information.
- **Bootstrap**: Integrated for styling and responsiveness.
- **Faker**: Utilized for generating appropriate data.
- **Method-Override**: Allows you to intercept requests and override HTTP methods as needed within your project.
- **Body-Parser**: Middleware commonly used in Node.js applications for handling HTTP request bodies. It parses JSON, raw, text, and URL encoded form data, making the parsed data available on req.body.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution for modeling application data, allowing you to define schemas with strongly-typed data.
- **MongoDB**: Official MongoDB driver for Node.js. Simplifies the process of interacting with MongoDB databases from Node.js applications by providing a high-level API on top of the native MongoDB driver.


## Enhanced UI

- Additional select fields for country, hotel, date arrival, date departure, and quantity of persons (adult and children) for comprehensive Tour editing.
- Dropdowns for selecting city, along with control buttons (view tour, add tour, delete tour, history).
- Updated Tour result displayed with a meaningful interpretation and enhanced style for a visually appealing interface.

## Tour History

- The application stores booking history in a JSON file structure.
- A history feature is implemented to store recently deleted Tours with timestamps.
- A route is created to view the history of Tours.

Feel free to explore and enjoy the Tour Management System!


# travel

# SKKU Scholarship Assistant (스꾸장학비서)

## Overview
SKKU Scholarship Assistant is a project designed to make it easier for Sungkyunkwan University (SKKU) students to gather and check scholarship-related notices and announcements.  
- **Scholarship Notice Scraping**: Automatically collects scholarship notices and announcements from SKKU using Scrapy.  
- **Data Storage**: Stores collected data in MongoDB for efficient retrieval.  
- **Backend API**: Provides a RESTful API built with Node.js so that users can easily query scholarship information.  
- **Scalability**: Uses Docker for convenient deployment and management.

## How to Run

Below are the steps to run both the API server and the MongoDB service in a Docker environment:

1. **Create and Configure the `.env` File**  
   In the project’s root directory, create a `.env` file containing the following:
   ```bash
   MONGODB_URI=mongodb://<user>:<password>@localhost:27017/<database>
   ```
   - Replace `<user>`, `<password>`, and `<database>` with your actual credentials.  
   - If you’re unsure about the details of the `MONGODB_URI`, please contact the project contributor.

2. **Start Docker Containers**  
   ```bash
   docker-compose up -d
   ```
   - The `-d` option runs the containers in the background.  
   - Once the command completes, you can verify the containers are running by using:
     ```bash
     docker-compose ps
     ```

3. **Access the Backend Container**  
   ```bash
   docker exec -it backend bash
   ```

4. **Install Dependencies**  
   Inside the backend container, run:
   ```bash
   npm install
   ```

5. **Start the API Server**  
   ```bash
   node app.js
   ```
   - If the server starts correctly, you can access it in your web browser at [http://localhost:8082](http://localhost:8082).

## How to Use Scrapy and Parsing

For detailed instructions on how to scrape and parse data, please refer to the [skku_notice/README.md](./skku_notice/README.md).

## Backend Developer

2024 Fall SKKU SE CLASS 42 TEAM 10 Backend developer

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/JihunSKKU">
        <img src="https://github.com/JihunSKKU.png" width="60px;" alt="JihunSKKU"/>
        <br />
        <sub><b>Jihun Kim</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/kdonghyun13">
        <img src="https://github.com/kdonghyun13.png" width="60px;" alt="kdonghyun13"/>
        <br />
        <sub><b>Donghyun Kim</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ohsj3781">
        <img src="https://github.com/ohsj3781.png" width="60px;" alt="ohsj3781"/>
        <br />
        <sub><b>Seungjae Oh</b></sub>
      </a>
    </td>
  </tr>
</table>

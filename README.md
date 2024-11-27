# 스꾸장학비서

## Overview
TBD

## How to Run

Follow these steps to set up and run the API and MongoDB servers in Docker.

1. Open a terminal in the project directory and run the following command to start all containers in the background:
    ```bash
    docker exec -it backend bash
    ```

2. Install Dependencies in the Backend Container
    ```bash
    npm install
    ```

3. Start the API Server. In the backend container, start the API server by running:
    ```bash
    node app.js
    ```

4. Once the API server is running, you can access it at [http://localhost:8082](http://localhost:8082) in your web browser.

5. In the project directory, ensure you have a .env file containing the following:
    ```bash
    MONGODB_URI=mongodb://<user>:<password>@localhost:27017/<database>
    ```
    Replace <user>, <password>, and <database> with the appropriate values. If you're unsure about the MONGODB_URI details, please contact the contributor for assistance.

## How to Use Scrapy and Parsing

For detailed instructions on how to scrape and parse data, please refer to the [skku_notice/README.md](./skku_notice/README.md).


## License
TBD

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

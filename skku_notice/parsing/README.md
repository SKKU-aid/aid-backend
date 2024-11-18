### Testing and Parsing Data Using a Jupyter Notebook

1. Ensure your `.env` file is correctly configured with your API keys and MongoDB URI.
2. Start the Jupyter Notebook server and navigate to the following script (in Linux):
    ```bash
    docker run -it --name jupyter-container \
        -p 8888:8888 \
        -v "$(pwd)":/app \
        aid-backend-image \
        /bin/bash -c "source /usr/local/app/venv/bin/activate && jupyter notebook --ip=0.0.0.0 --no-browser --allow-root"
    ```

    **Note:** If you see an error indicating that the container name `jupyter-container` is already in use, it means the container is currently running or already exists. In this case, follow these steps:

    - Stop the existing container:
        ```bash
        docker stop jupyter-container
        ```
    - Remove the container:
        ```bash
        docker rm jupyter-container
        ```
    - Run the command again to start a new container.
3. Open the `skku_notice\parsing\langchain_script.ipynb` notebook to initiate the parsing process.
4. Execute each cell in the notebook to process the scraped data into a MongoDB-compatible JSON format and add it to the database.
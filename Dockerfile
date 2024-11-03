FROM ubuntu:24.04
WORKDIR /usr/local/app

# Clear apt-get cache and update package lists
RUN rm -rf /var/lib/apt/lists/* && \
    apt-get update && \
    apt-get upgrade -y

# Install necessary packages
RUN apt-get install -y \
    software-properties-common \
    curl \
    wget \
    gnupg \
    git \
    bash \
    build-essential \
    gcc \
    g++ \
    python3 \
    python3-pip \
    python3-venv \
    vim

# Set up a virtual environment for Python
RUN python3 -m venv /usr/local/app/venv

# Activate the virtual environment and install LangChain and Scrapy
RUN /usr/local/app/venv/bin/pip install langchain==0.3.2 scrapy

# Install Node.js and npm using NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Set up working directory
WORKDIR /app

# Install MongoDB
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor

RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-8.0.list
RUN apt-get update
RUN apt-get install -y mongodb-org

# Install Node.js dependencies (express and mongoose)
COPY package*.json ./
RUN npm install

# Create MongoDB data directory
RUN mkdir -p /data/db

# Activate the virtual environment automatically when the container starts
RUN echo "source /usr/local/app/venv/bin/activate" >> ~/.bashrc

# Use bash as the default shell
SHELL ["/bin/bash", "-c"]

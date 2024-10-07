#Written By: Oh Seung Jae
#Type the following command to build the image:
# docker build -t swe_ubuntu_image .
# docker run -i -t --name swe_ubuntu_container swe_ubuntu_image

FROM ubuntu:24.04
WORKDIR /usr/local/app

# Clear apt-get cache and update package lists
RUN rm -rf /var/lib/apt/lists/* && \
    apt-get update && \
    apt-get upgrade -y

# Update and install necessary packages
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
    python3-pip

RUN apt-get update && apt-get -y upgrade


# Install Node.js and npm
ENV NVM_DIR=/root/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash && \
    . $NVM_DIR/nvm.sh && \
    nvm install 22 && \
    nvm alias default 22 && \
    ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" /usr/bin/node && \
    ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" /usr/bin/npm && \
    ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npx" /usr/bin/npx

# Set up working directory
WORKDIR /app

# Install MongoDB
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
 gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
--dearmor
RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-8.0.list
RUN apt-get update
RUN apt-get install -y mongodb-org


# Default command to keep the container running
CMD ["bash"]
SHELL ["/bin/bash", "-c"]
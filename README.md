# Opinion Gate.

## Overview

This repository contains the backend implementation for a web application designed to manage customer feedback with user authentication.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT)

## Installation

1. **Clone the repository:**

    ```bash
    git clone git@github.com:imparag28/OpinionGate.git
    cd  OpinionGate
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT = 3000
MONGODB_URL =
CORS_ORIGIN=*


ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY =
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY= 
```

## Usage

1. **Clone the repository:**

    ```bash
    npm start
The server will run at http://localhost:3000 by default.

# API Endpoints

The following endpoints are available in the Customer Feedback Backend API:

## 1. Login

- **Endpoint:** `POST users/login`

## 2. Registration

- **Endpoint:** `POST users/register`

## Postman API Documentation

[Postman Documentation](https://documenter.getpostman.com/view/31848798/2s9YsKeWhn)








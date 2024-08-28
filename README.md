# Nest Comment System

## Overview

The E-commerce Recommendation System is a Node.js application designed for an e-commerce platform to handle user management, product management, and personalized product recommendations. This system supports user creation, product creation and retrieval, recording user purchases, and generating product recommendations based on user purchases. It includes user creation, caching, and is dockerized for deployment.

## Features

- User creation
- Create and retrieve products
- Record user purchases
- Generate personalized product recommendations
- Pagination for product retrieval
- Caching using node-cache
- Dockerized deployment

## API Endpoints

### User Authentication

- **Register User**

  - `POST /api/users`
  - **Request Body:**
    ```json
    {
      "name": "string",
      "email": "string"
    }
    ```
  - **Response:**

    ```json
    {
      "success": true,
      "message": "User added successfully",
      "data": {
        "email": "string",
        "name": "string",
        "_id": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```

- **Get User**

  - `GET /api/users`
  - **Request Body:**

    ```json
    {
      "email": "string"
    }
    ```

  - **Response:**

    ```json
    {
      "success": true,
      "message": "User found successfully",
      "data": {
        "email": "string",
        "name": "string",
        "_id": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "purchases": [
          {
            "productId": "string",
            "category": "string",
            "purchasedAt": "string"
          }
        ]
      }
    }
    ```

- **Record Purchase**

  - `POST /api/users/:userId/purchases`
  - **Request Body:**

    ```json
    {
      "productIds": ["string"]
    }
    ```

  - **Response:**
    ```json
    {
      "success": true,
      "message": "Products purchased successfully",
      "data": {
        "email": "string",
        "name": "string",
        "_id": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "purchases": [
          {
            "productId": "string",
            "category": "string",
            "purchasedAt": "string"
          }
        ]
      }
    }
    ```

- **Get Recommendations**
  - `GET /api/user/:userId/recommendations`
  - **Response:**
    ```json
    {
      "success": true,
      "message": "Recommendations fetched successfully",
      "data": [
        {
          "name": "string",
          "category": "string",
          "price": "number",
          "description": "string",
          "_id": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
    ```

### Product API

- **Add Product**

  - `POST /api/product`
  - **Request Body:**
    ```json
    {
      "name": "string",
      "category": "string",
      "price": "number",
      "description": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "success": true,
      "message": "Product added successfully",
      "data": {
        "name": "string",
        "category": "string",
        "price": "number",
        "description": "string",
        "_id": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```

- **Get All Products**

  - `GET /api/product`
  - **Request Query:**

    ```text
    {
    "page": "number",
    "limit": "number"
    }
    ```

  - **Response:**
    ```json
    {
      "success": true,
      "message": "Products fetched successfully",
      "data": [
        {
          "name": "string",
          "category": "string",
          "price": "number",
          "description": "string",
          "_id": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
    ```

- **Upload Products From JSON file**

  - `POST /api/products/uploads`
  - **Request Body:**

    ```json
    [
      {
        "name": "string",
        "category": "string",
        "price": "number",
        "description": "string"
      }
    ]
    ```

  - **Response:**
    ```json
    {
      "success": true,
      "message": "Products uploaded successfully"
    }
    ```

## Setup and Installation

1. Clone the repository

   ```bash
   git clone https://github.com/saswatsam786/ecommerce_recommendation_system
   cd ecommerce_recommendation_system
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Setup environment variables

   Create a `.env.development` and `.env.production` file in the root directory and add the following:

   ```bash
    PORT=6005
    MONGO_URL=mongodb-uri
   ```

4. Run the application

   ```bash
   npm run watch
   npm run dev
   ```

## Docker

1. Build Docker image

   ```bash
    docker build -t ecommerce_recommendation_system .
   ```

2. Run Docker container

   ```bash
    docker-compose up
   ```

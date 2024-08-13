
# Background Remover API Documentation

## Overview

The Background Remover API is a Node.js application built with Express that processes images to remove backgrounds using the Photoroom API. This API provides an endpoint for clients to submit image URLs, download the image, and return a version with the background removed.

## Prerequisites

- Node.js installed on your machine
- An API key from PhotoRoom
- A Canva App ID
- Environment variables configured for `PHOTOROOM_API_KEY` and `CANVA_APP_ID`

## Usage

   **Accessing the API:**

   Use the following endpoint to remove the background from an image:

   ### POST `/api/remove-background`

   **Request Body:**

   ```json
   {
     "imageUrl": "string"
   }
   ```

   - `imageUrl`: The URL of the image from which the background should be removed.

   **Response:**

   - Returns the processed image with the background removed.
   - The image is returned as a `png`.


## Configuration

- **CORS Configuration:**

  The application restricts origins based on an allowlist that includes the Canva App's domain. The allowlist is configured using the `CANVA_APP_ID` environment variable.

- **Environment Variables:**

  - `PHOTOROOM_API_KEY`: The API key for authenticating requests to the PhotoRoom API.
  - `CANVA_APP_ID`: The ID of the Canva App, used to configure CORS.

## Error Handling

The application provides error handling for various scenarios:

- Missing image URL in the request body.
- Failed image download.
- Errors from the PhotoRoom API.
- General server errors.

## Acknowledgments

- [PhotoRoom API](https://www.photoroom.com/api) for image background removal.
- [Express.js](https://expressjs.com/) for the server framework.

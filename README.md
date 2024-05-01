**Movie Database (Clone to IMDb)**

This project is a clone of IMDb, allowing users to browse movies and get information about them.

## Environment Variables

### Backend

- `MONGODB_URI`: MongoDB connection URI.
- `SECRET`: Secret key for JWT authentication.
- `TMDB_API_KEY`: API key for The Movie Database (TMDB).
- `BASE_URL`: Base URL for the backend server (default: "http://localhost:5000").
- `AWS_ACCESS_KEY_ID`: Access key ID for AWS S3.
- `AWS_SECRET_ACCESS_KEY`: Secret access key for AWS S3.
- `AWS_BUCKET_NAME`: Name of the AWS S3 bucket.

### Frontend

- `MONGODB_URI`: MongoDB connection URI.
- `AWS_ACCESS_KEY_ID`: Access key ID for AWS S3.
- `AWS_SECRET_ACCESS_KEY`: Secret access key for AWS S3.
- `AWS_BUCKET_NAME`: Name of the AWS S3 bucket.
- `VITE_TMDB_API_KEY`: API key for The Movie Database (TMDB).
- `TMDB_ACCESS_TOKEN_AUTH`: Access token for TMDB authentication.
- `VITE_BASE_URL`: Base URL for the backend server (default: "http://localhost:5000").
- `VITE_AWS_IMAGE_BASE_URL`: Base URL for AWS S3 images.

## Running with Docker

To run the project using Docker, simply add a docker-compose file and follow the structure below:

```yaml
version: '3'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - MONGODB_URI=
      - AWS_ACCESS_KEY_ID=
      - AWS_SECRET_ACCESS_KEY=
      - AWS_BUCKET_NAME=
      - VITE_TMDB_API_KEY=
      - TMDB_ACCESS_TOKEN_AUTH=
      - VITE_BASE_URL=http://localhost:5000
      - VITE_AWS_IMAGE_BASE_URL=
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=
      - SECRET=secret
      - TMDB_API_KEY=
      - BASE_URL=http://localhost:5000
      - AWS_ACCESS_KEY_ID=
      - AWS_SECRET_ACCESS_KEY=
      - AWS_BUCKET_NAME=
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## Libraries Used

- **react-responsive-carousel**: A React component for creating responsive carousels. [npm](https://www.npmjs.com/package/react-responsive-carousel)
- **react-loading-skeleton**: A React component to create loading skeletons. [npm](https://www.npmjs.com/package/react-loading-skeleton)

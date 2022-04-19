# api.mediamod.dev

This repository contains the code for [api.mediamod.dev](https://api.mediamod.dev).

This API allows MediaMod users to publish themes, login to Spotify via the Authorization Code Flow, and more.

We encourage users to contribute to the API, and host it themselves if they want to. Read the [MediaMod Wiki](https://github.com/MediaModMC/MediaMod/wiki) for instructions on how to use a custom API host instead of the default.

## Running the API

### Inside of a Docker Container (Recommended)

1. Create another directory for your container (i.e. `/data/containers/api.mediamod.dev` will be used in our example)
2. Copy `docker-compose.yml` and `Dockerfile.migration` to this new directory
3. Create a `.env` file

    **/data/containers/api.mediamod.dev/.env**

    ```
    # The SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET can be found on the Spotify Developer Dashboard
    SPOTIFY_CLIENT_ID=...
    SPOTIFY_CLIENT_SECRET=...
    SPOTIFY_REDIRECT_URI=http://localhost:9103/callback
    PORT=3001
    DATABASE_URL=postgresql://user:password@ip:port/db_name
    ```

4. Run the migration container to initialize the database

    _Note: you should also do this whenever the DB schema changes_

    ```
    $ docker-compose run migration
    ```

5. Start the containers and the API should be accessible on your port!
    ```
    $ docker-compose up -d
    ```

### Locally on your machine (Not recommended)

1. Install dependencies
    ```
    $ yarn
    ```
2. Ensure that you have postgresql installed and setup correctly on your system (i.e. user created, etc)
3. Create a `.env` file

    **.env**

    ```
    # The SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET can be found on the Spotify Developer Dashboard
    SPOTIFY_CLIENT_ID=...
    SPOTIFY_CLIENT_SECRET=...
    SPOTIFY_REDIRECT_URI=http://localhost:9103/callback
    PORT=3001
    DATABASE_URL=postgresql://user:password@ip:port/db_name
    ```

4. Start the API, it should now be accessible on the port specified in your `.env` file
    ```
    $ yarn start
    ```

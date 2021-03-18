# TODO-APP


# 1. install postgres using 
## sudo docker run --restart unless-stopped --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/postgis:/var/lib/postgresql/data postgis/postgis

# 2. Migrate db using :
## npx prisma migrate dev --name "init" --preview-feature

# 3. Run backend :
## node src/index.ts

#4. Run frontend:
## npm start


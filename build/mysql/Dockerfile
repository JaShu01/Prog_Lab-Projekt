FROM mysql:latest
USER root


RUN chmod -R 755 /docker-entrypoint-initdb.d/

# Copy the database initialization script
COPY ./initdb.d/ /docker-entrypoint-initdb.d/


RUN chmod 755 /var/lib/mysql
RUN chmod -R 755 /docker-entrypoint-initdb.d/

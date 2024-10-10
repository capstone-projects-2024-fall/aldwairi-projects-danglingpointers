# README

## Confirm Installation
- Python [↗](https://www.python.org/downloads/)
  - `python --version` OR `py, python3`
  - Output: >= 3.11.0
- pip
  - `pip --version`
  - Output: >= 24.0
- Node.js [↗](https://nodejs.org/en/download/package-manager)
  - `node --version`
  - Output: >= 18.15.0
- npm
  - `npm --version`
  - Output: >= 9.5.0
- Docker Desktop [↗](https://docs.docker.com/desktop/install/windows-install/)
  - `docker-compose --version`
  - Output: 2.28.1-desktop.1
  
## How to Host Application with Docker
- Navigate to DanglingPointers\application
```
$ python -m venv .venv
$ .venv\Scripts\activate.ps1 (PowerShell)
$ .venv\Scripts\activate (Windows CMD)
$ source bin/activate (Linux/MacOS)
$ pip install -r backend/requirements.txt
$ docker-compose up --build
```

## Additional Tips 
- Open a second terminal window

```
$ docker-compose ps

NAME                        IMAGE             COMMAND                  SERVICE       CREATED              STATUS              PORTS
application-api-1           application-api   "bash -c 'python man…"   api           About a minute ago   Up About a minute   0.0.0.0:8000->8000/tcp
application-my-postgres-1   postgres          "docker-entrypoint.s…"   my-postgres   About a minute ago   Up About a minute   5432/tcp
application-redis-1         redis:latest      "docker-entrypoint.s…"   redis         About a minute ago   Up About a minute   6379/tcp
application-web-1           application-web   "docker-entrypoint.s…"   web           About a minute ago   Up About a minute   0.0.0.0:3000->3000/tcp

$ docker network ls

NETWORK ID     NAME                  DRIVER    SCOPE
...            ...                   ...       ...

$ docker network inspect <NAME>

$ docker-compose exec api bash
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py createsuperuser
```

**ALWAYS RUN `docker-compose down` WHEN FINISHED DEVELOPING**
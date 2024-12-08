# Dangling Pointers

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
$ python manage.py loaddata users_table items_table security_questions
$ python manage.py createsuperuser (follow prompts... can view Admin panel at localhost:8000/admin)
```

**ALWAYS RUN `docker-compose down` WHEN FINISHED DEVELOPING**

## Additional Sources

- Create a Django project [↗](https://docs.djangoproject.com/en/5.0/intro/tutorial01/#creating-a-project)
- Start a Django app [↗](https://docs.djangoproject.com/en/5.0/intro/tutorial01/#creating-the-polls-app)
- psycopg2 installation [↗](https://www.psycopg.org/install/)
- PostgreSQL and Django [↗](https://stackoverflow.com/questions/5394331/how-to-set-up-a-postgresql-database-in-django)
- Django Extensions [↗](https://django-extensions.readthedocs.io/en/latest/)
- Django Channels [↗](https://channels.readthedocs.io/en/stable/installation.html)
- Redis Channel Layer [↗](https://channels.readthedocs.io/en/stable/topics/channel_layers.html?highlight=redis#redis-channel-layer)
- Channels Redis package [↗](https://pypi.org/project/channels-redis/)
- Redis [↗](https://redis.io/docs/latest/)
- Create a Vite project with React [↗](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
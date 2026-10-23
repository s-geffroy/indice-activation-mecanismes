FROM python:3.13-alpine

WORKDIR /app
COPY server.py questionnaire.json /app/

# Utilisateur non-root, meme UID que le worker : les deux partagent le volume
# iam_data. /data est cree ICI et possede par 'app' : Docker initialise un
# volume nomme vide avec le proprietaire du repertoire de l'image.
RUN adduser -D -u 10001 app && mkdir -p /data && chown -R app:app /app /data
USER app

# Port interne seulement : l'exposition passe par Traefik (app-exposure.py),
# jamais par une publication de port.
EXPOSE 8080
# -u : sortie non bufferisee, sinon les logs n'apparaissent que par blocs.
CMD ["python3", "-u", "/app/server.py"]

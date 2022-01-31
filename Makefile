PROJECT_PREFIX = "secretstash"
DOCKER_COMMAND = DOCKER_BUILDKIT=1 docker compose -p ${PROJECT_PREFIX} -f ./docker-compose.yml

start-all:
	${DOCKER_COMMAND} up -d

rebuild-all:
	${DOCKER_COMMAND} up --build -d

stop-all:
	${DOCKER_COMMAND} stop --remove-orphans

logs:
	${DOCKER_COMMAND} logs -f ${CONTAINER}

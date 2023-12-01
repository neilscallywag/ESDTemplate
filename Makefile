PROJECT_NAME = "esd"
LOCAL_DEPLOY_DIR = "deployment/docker"


# ---------------------------------------
# For deploying docker containers locally
# ---------------------------------------
up:
	@docker compose -p ${PROJECT_NAME} \
					-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
					up --build -d --remove-orphans
# ---------------------------------
# For tearing down local deployment
# ---------------------------------
down:
	@docker compose -p ${PROJECT_NAME} \
				    -f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
				    down
down-clean:
	@docker compose -p ${PROJECT_NAME} \
				    -f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
				    down --volumes --remove-orphans
	@docker system prune -f

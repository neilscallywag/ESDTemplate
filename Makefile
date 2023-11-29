PROJECT_NAME = "esd"
LOCAL_DEPLOY_DIR = "deployment/local"
SHELL := /bin/bash

# ---------------------------------------
# For deploying docker containers locally
# ---------------------------------------


kube-up:
	@docker compose -p ${PROJECT_NAME} \
					-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
					up --build  && \
	source ./${LOCAL_DEPLOY_DIR}/.env && \
	kubectl apply -f ${LOCAL_DEPLOY_DIR}/kubernetes-manifest.yaml


kube-down-clean:
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		down --volumes --remove-orphans
	@docker system prune -f
	@kubectl delete services --all -n default

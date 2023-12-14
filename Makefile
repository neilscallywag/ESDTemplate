PROJECT_NAME = "esd"
LOCAL_DEPLOY_DIR = "deployment/docker"

npm-install: npm-install-subdirectories
	@echo "Running npm install to set up Husky and other dependencies..."
	@npm install

npm-install-subdirectories:
	@echo "Running npm install in subdirectories..."
	@cd authentication && npm install
	@cd client && npm install
	@cd frontend && npm install

# ---------------------------------------
# For deploying docker containers locally
# ---------------------------------------
up: npm-install
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		up --build -d --remove-orphans

kong-migrations: npm-install
	@docker compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		up kong-migrations 
		
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

nobuild/up: npm-install
	@docker-compose -p ${PROJECT_NAME} \
		-f ${LOCAL_DEPLOY_DIR}/docker-compose.yml \
		up -d

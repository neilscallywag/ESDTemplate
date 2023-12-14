PROJECT_NAME = "esd"
LOCAL_DEPLOY_DIR = "deployment/docker"
NPM_SUBDIRS = authentication client frontend

npm-install: npm-install-subdirectories
	@echo "Running npm install to set up Husky and other dependencies..."
	@if [ ! -d "node_modules" ]; then \
		npm install; \
	fi
	@echo "All npm dependencies installed."

npm-install-subdirectories:
	@echo "Running npm install in subdirectories..."
	@for dir in ${NPM_SUBDIRS}; do \
		if [ ! -d "$${dir}/node_modules" ]; then \
			echo "Running npm install in $${dir} service..."; \
			cd $${dir} && npm install; \
		fi \
	done
	@echo "All subdirectory dependencies installed."

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

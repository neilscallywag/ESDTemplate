# Enterprise Solution Development IS213 template files to quickly create a new project
- [Enterprise Solution Development IS213 template files to quickly create a new project](#enterprise-solution-development-is213-template-files-to-quickly-create-a-new-project)
  - [Folder Structure](#folder-structure)
  - [Commit Hooks](#commit-hooks)
  - [Miscellaneous](#miscellaneous)
    - [Makefile](#makefile)

## Folder Structure

1. **authentication:**
   - Contains code related to authentication and authorization.
   - Includes configuration files, controllers, entities, middlewares, routes, services, and types.

2. **deployment:**
   - Contains deployment-related files, including Docker and Kubernetes configurations.
   - Subfolders for Docker and Kubernetes deployment setups.

3. **downstream-services:**
   - Contains subfolders for different downstream services. All the services here are to be behind the kong gateway.
   - Each service has its Dockerfile and code files.

4. **frontend:**
   - Represents the front-end portion of the project.
   - Includes configuration files, React components, constants, features, and more.
   - Typical structure for a web application.

5. **kong:**
   - Contains code related to Kong API Gateway.
   - Includes Kong configurations and custom authentication plugin.

6. **Makefile:**
   - Makefile for running various project-related tasks.

## Commit Hooks
Husky is used in tandem with:

lint-staged to ensure files are linted on commit
commitlint to ensure commits adhere to convention on push


## Miscellaneous
### Makefile
Refer to the [`/docs/Makefile.md`](/docs/Makefile.md) which provides instructions on how to install Makefile on both Windows and Ubuntu.

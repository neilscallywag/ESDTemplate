# Enterprise Solution Development IS213 template files to quickly create a new project
- [Enterprise Solution Development IS213 template files to quickly create a new project](#enterprise-solution-development-is213-template-files-to-quickly-create-a-new-project)
  - [Folder Structure](#folder-structure)
  - [Commit Hooks](#commit-hooks)
  - [Quick Start](#quick-start)
  - [Miscellaneous](#miscellaneous)
    - [Makefile](#makefile)

## Folder Structure

1. **authentication:**
   - Contains code related to authentication and authorization.

2. **deployment:**
   - Contains deployment-related files, including Docker and Kubernetes configurations.
   - Subfolders for Docker and Kubernetes deployment setups.

3. **downstream-services:**
   - Contains subfolders for different downstream services. All the services here are to be behind the kong gateway.
   - Each service has its Dockerfile and code files.

4. **frontend:**
   - Represents the front-end portion of the project.

5. **kong:**
   - Contains code related to Kong API Gateway.
   - Includes Kong configurations and custom authentication plugin.

6. **Makefile:**
   - Makefile for running various project-related tasks.

## Commit Hooks
Husky is used in tandem with:

**lint-staged** to ensure files are linted on commit

**commitlint** to ensure commit messages adhere to [convention](https://www.conventionalcommits.org/en/v1.0.0/). 

## Quick Start

- Run npm install to install husky and commit lints. 
```bash
npm install
```

- Populate all the environment variables
   
- Run make commands to start local development using docker
```bash
make up
```
## Miscellaneous
### Makefile
Refer to the [`/docs/Makefile.md`](/docs/Makefile.md) which provides instructions on how to install Makefile on both Windows and Ubuntu.

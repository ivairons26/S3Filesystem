# Run Application

npm i
npm run dev

## Explaining the Application

Upon first itteraction the local storage is checked for bucket credentials, if not found the configuration form is shown, afterwards the creds are saved in local storage in connectionString property. The structure of the file system is saved in a single file ~s3_filesystem_structure~ to avoid recalculation on each load/re-render.

### Room for Improvement

The application has many ways in which it could be improved and here are some of them:

1. Although on init of FyleSystem component only one file is requested that is ~s3_filesystem_structure~ in which we hold our system structure, if we have a bigger structure it could become a problem as aa lot of DOM components will be created.
2. Create modal for folder and file is now one, it is better to be split into two and each should hold only its own business logic.
3. The top bar in the MainView component could be extracted - first to reduce the size of the main component and second so it could allow easy reuse like the case when we are showing file content.
4. Ideally for production readiness every functionallity should be covered with unit/integration tests.

I

#### Tests

npm run test

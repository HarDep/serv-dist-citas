
# Medical consultations server

A server to store, create, update and consult medical consultations.


## Authors

- [@Harold-Alvarado](https://github.com/HarDep)
- [@Sebastian-Mejia](https://github.com/Sebasmejia123)
- [@Luis-Rodriguez](https://github.com/luismiguel44)


## Environment Variables

To run the server, you will need to create the .env file in the root directory and add the following environment variables to your .env file

`PORT`

`CLIENT_HOST`


## Run Locally

Clone the project

```bash
  git clone https://github.com/HarDep/serv-dist-citas.git
```

Install server dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Now you can make requests to http://localhost:3200 (if your using the 3200 port), to test the project


## Endpoints

### 1. Create a consultation

- **Route:** `POST /api/v1/consultations?cc={cc}&date={date}`
- **Valores de query de creación:**
  - `cc` (mandatory): Patient's citizenship ID.
  - `date` (mandatory): Date of the consultation.
- **Example:** `POST /api/v1/consultations?cc=123&date=2021-01-01 00:00 AM`
- **Response:**
  - **201 Created**
    ```json
    {
      "consultationCode": "cc-1620000000000000"
    }
    ```

### 2. 

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
- **Query values:**
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

### 2. Find consultations by CC

- **Route:** `GET /api/v1/consultations?cc={cc}`
- **Query values:**
  - `cc` (mandatory): Patient's citizenship ID.
- **Example:** `GET /api/v1/consultations?cc=123`
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "cc": "123",
        "consultationCode": "cc-1620000000000000",
        "consultationDate": "2021-01-01 00:00 AM",
        "isCancelled": false
      }
    ]
    ```

### 3. Find Consultation Authorization

- **Route:** `GET /api/v1/consultations/authorization/{consultationCode}`
- **Params values:**
  - `consultationCode` (mandatory): Consultation code.
- **Example:** `GET /api/v1/consultations/authorization/cc-1620000000000000`
- **Response:**
  - **200 OK** consultation's authorization file

### 4. Find all Consultations

- **Route:** `GET /api/v1/consultations`
- **Example:** `GET /api/v1/consultations`
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "cc": "123",
        "consultationCode": "cc-1620000000000000",
        "consultationDate": "2021-01-01 00:00 AM",
        "isCancelled": false
      }
    ]
    ```

### 5. Cancel Consultation

- **Route:** `PUT /api/v1/consultations/{consultationCode}`
- **Params values:**
  - `consultationCode` (mandatory): Consultation code.
- **Example:** `PUT /api/v1/consultations/cc-1620000000000000`
- **Response:**
  - **200 OK**
    ```json
    {
      "cc": "123",
      "consultationCode": "cc-1620000000000000",
      "consultationDate": "2021-01-01 00:00 AM",
      "isCancelled": true
    }
    ```

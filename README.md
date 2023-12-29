Pre-requisite:

MONGO & NODE installation

1)Run command 'npm i'
2)Run command 'npm start' 

CURLS: 

SIGN UP CURL:
curl --location 'http://localhost:3000/signup' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'userId=1' \
--data-urlencode 'email=renumanhas418@gmail.com' \
--data-urlencode 'password=renu418' \
--data-urlencode 'role=admin' \
--data-urlencode 'name=Renu Manhas'

LOGIN CURL:
curl --location 'http://localhost:3000/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=renumanhas418@gmail.com' \
--data-urlencode 'password=renu418'

GET PRODUCTS CURL:
curl --location 'http://localhost:3000/product' \
--header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NThlN2UzNTMwMDFhOGJjZjQ4YWFhYTAiLCJpYXQiOjE3MDM4MzcyNDEsImV4cCI6MTcwMzkyMzY0MX0.1t7c3ZA-izhd2OEW_arBzC5BS1eJP-rE73AzfphnZaY'

# [Trivago](https://www.trivago.com/) Backend Clone

## Entities

### User

Every User registers with email, password and a role, which could be either host or guest.

Guests are only allowed to see the available accommodations, while hosts are also allowed to perform CRUD operations on their own accommodation.

## Accommodation

An Accommodation entry has a name, a host (with ref to Users ), a short description, a maxGuests number, and is located in a city.

## Authorization Endpoints

- **POST /register**

expects email, password and role
creates a new user
returns a JWT token already valid

- **POST /login**

returns a JWT token

### Resource Endpoints

⚠️ All users are required to log in first and receive a JWT token valid for the following requests.

A 401 (unauthorized) status code should be returned when requests are performed without a valid token.

#### Guests and hosts allowed

- **GET /accommodations**

will return the full list of accommodations

- **GET /accommodations/:id**

returns an existing accommodations
404 if not existing

- **GET /user/me**

will return your user information without the password

### Hosts only

⚠️ When a guest user is trying to perform these requests, a 403 (forbidden) error code should be returned

- **GET /user/me/accommodations**

returns the full list of managed accommodations

- **POST /accommodations**

will add a new accommodation
400 if invalid data

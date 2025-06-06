# Cinema E-Booking System (Spring Boot + React)

This project is a **full-stack movie booking system** with a **Spring Boot backend** and a **React frontend**.

---

## How to Run the Project
You can run the project in **two ways**:
1. **Using the provided scripts** (`start_project.sh` and `stop_project.sh`)
2. **Manually starting frontend & backend separately**

---

## Running the Project with Scripts
To **start** the project (backend + frontend in separate terminals):
```sh
./start_project.sh

To **stop** the Project
```sh
./stop_project.sh

---


`start_project.sh` will:
- Kill any existing backend (port `8080`) and frontend (port `5173`).
- Start the backend in a new terminal.
- Start the frontend in a new terminal.
- Open the browser at `http://localhost:5173/`.

`stop_project.sh` will:
- Find and terminate any backend and frontend processes.

---

## Running the Backend Manually
If you want to start the backend without using the script:

1. Navigate to the Backend Directory:
cd path/backend

2. Build the backend (Compile & Package):
mvn clean install

3. Run the Spring Boot Application:
java -jar target/movieapp-0.0.1-SNAPSHOT.jar
(note that target/movieapp might be slightly different when you run it, but will be named similarly)

After running this, the backend will be available at `http://localhost:8080`.

---

## Running the Frontend Manually
If you want to start the frontend without using the script:

1. Navigate to the Frontend Directory:
cd path/frontend

2. Install Dependencies (only needed the first time):
npm install

3. Start the Frontend:
npm run dev

This will run the frontend at `http://localhost:5173/`.

---

# Backend Structure
The Spring Boot backend follows a layered architecture:

backend/
│── src/
│   ├── main/
│   │   ├── java/com/example/movieapp/
│   │   │   ├── controller/      (Handles API requests)
│   │   │   │   ├── MovieController.java
│   │   │   │   ├── ScreeningController.java
│   │   │   │   ├── SeatController.java
│   │   │   │   ├── ShowroomController.java 
│   │   │   │   ├── ReviewController.java  
│   │   │   │   ├── AddressController.java  
│   │   │   │   ├── PaymentCardController.java  
│   │   │   │   ├── CustomerController.java  
│   │   │   │   ├── AdminController.java  
│   │   │   │   ├── PromotionController.java       
│   │   │   │   ├── BookingController.java         
│   │   │   │   ├── TicketController.java          
│   │   │   │   ├── TicketPricingController.java   
│   │   │   ├── service/         (Contains business logic)
│   │   │   │   ├── MovieService.java
│   │   │   │   ├── ScreeningService.java
│   │   │   │   ├── SeatService.java
│   │   │   │   ├── ShowroomService.java  
│   │   │   │   ├── ReviewService.java  
│   │   │   │   ├── AddressService.java  
│   │   │   │   ├── PaymentCardService.java  
│   │   │   │   ├── CustomerService.java  
│   │   │   │   ├── AdminService.java  
│   │   │   │   ├── PromotionService.java          
│   │   │   │   ├── EmailService.java              
│   │   │   │   ├── BookingService.java            
│   │   │   │   ├── TicketService.java             
│   │   │   │   ├── TicketPricingService.java      
│   │   │   ├── repository/      (Handles database queries)
│   │   │   │   ├── MovieRepository.java 
│   │   │   │   ├── ScreeningRepository.java
│   │   │   │   ├── SeatRepository.java
│   │   │   │   ├── ShowroomRepository.java 
│   │   │   │   ├── ReviewRepository.java  
│   │   │   │   ├── AddressRepository.java  
│   │   │   │   ├── PaymentCardRepository.java  
│   │   │   │   ├── CustomerRepository.java  
│   │   │   │   ├── AdminRepository.java  
│   │   │   │   ├── PromotionRepository.java       
│   │   │   │   ├── BookingRepository.java         
│   │   │   │   ├── TicketRepository.java          
│   │   │   │   ├── TicketPriceRepository.java     
│   │   │   ├── model/           (Defines entity models)
│   │   │   │   ├── Movie.java 
│   │   │   │   ├── Screening.java
│   │   │   │   ├── Seat.java
│   │   │   │   ├── Showroom.java 
│   │   │   │   ├── Review.java  
│   │   │   │   ├── Address.java  
│   │   │   │   ├── MPAARating.java                (Enum for ratings)
│   │   │   │   ├── PaymentCard.java  
│   │   │   │   ├── Customer.java  
│   │   │   │   ├── User.java  
│   │   │   │   ├── Admin.java  
│   │   │   │   ├── Status.java                    (Enum for customer status)
│   │   │   │   ├── Role.java                      (Enum for user roles)
│   │   │   │   ├── Promotion.java                 
│   │   │   │   ├── Booking.java                   
│   │   │   │   ├── Ticket.java                    
│   │   │   │   ├── TicketPrice.java               
│   │   │   │   ├── TicketType.java                 (Enum for ticket types)
│   │   │   ├── util/            (Utility classes)
│   │   │   │   ├── EncryptionUtil.java  
│   │   │   │   ├── VerificationUtil.java          
│   │   │   │   ├── VerificationCodeStore.java     
│   │   │   │   ├── PasswordResetCodeStore.java    
│   │   │   ├── MovieappApplication.java    (Main entry point)
│   ├── resources/
│   │   ├── application.properties      (Database & Spring settings)
│── pom.xml                                  (Project dependencies)





---

## Backend Explanation
| Layer      | File                          | Purpose                                                                      |
|------------|-------------------------------|------------------------------------------------------------------------------|
| Main       | MovieappApplication.java      | Starts the application                                                       |
| Controller | MovieController.java          | Handles API requests for movies                                              |
| Controller | BookingController.java        | Handles API requests for bookings                                            |
| Controller | ScreeningController.java      | Handles API requests for screenings                                          |
| Controller | SeatController.java           | Handles API requests for seats                                               |
| Controller | ShowroomController.java       | Handles API requests for showrooms                                           |
| Controller | ReviewController.java         | Handles API requests for reviews                                             |
| Controller | AddressController.java        | Handles API requests for addresses                                           |
| Controller | PaymentCardController.java    | Handles API requests for payment cards                                       |
| Controller | CustomerController.java       | Handles API requests for customers                                           |
| Controller | AdminController.java          | Handles API requests for admins                                              |
| Controller | PromotionController.java      | Handles API requests for promotions                                          |
| Controller | TicketController.java         | Handles API requests for creating and fetching tickets                       |
| Controller | TicketPricingController.java  | Handles API requests for managing ticket type pricing                        |
| Service    | MovieService.java             | Business logic for movies                                                    |
| Service    | BookingService.java           | Business logic for bookings                                                  |
| Service    | ScreeningService.java         | Business logic for screenings                                                |
| Service    | SeatService.java              | Business logic for seats                                                     |
| Service    | ShowroomService.java          | Business logic for showrooms                                                 |
| Service    | ReviewService.java            | Business logic for reviews                                                   |
| Service    | AddressService.java           | Business logic for addresses                                                 |
| Service    | PaymentCardService.java       | Business logic for payment cards                                             |
| Service    | CustomerService.java          | Business logic for customers                                                 |
| Service    | AdminService.java             | Business logic for admins                                                    |
| Service    | PromotionService.java         | Business logic for promotions                                                |
| Service    | EmailService.java             | Handles sending emails (verification, booking, password reset, etc.)         |
| Service    | TicketPricingService.java     | Business logic for managing ticket pricing by type                           |
| Repository | MovieRepository.java          | Database access for movies                                                   |
| Repository | BookingRepository.java        | Database access for bookings                                                 |
| Repository | ScreeningRepository.java      | Database access for screenings                                               |
| Repository | SeatRepository.java           | Database access for seats                                                    |
| Repository | ShowroomRepository.java       | Database access for showrooms                                                |
| Repository | ReviewRepository.java         | Database access for reviews                                                  |
| Repository | AddressRepository.java        | Database access for addresses                                                |
| Repository | PaymentCardRepository.java    | Database access for payment cards                                            |
| Repository | CustomerRepository.java       | Database access for customers                                                |
| Repository | AdminRepository.java          | Database access for admins                                                   |
| Repository | PromotionRepository.java      | Database access for promotions                                               |
| Repository | TicketRepository.java         | Database access for tickets                                                  |
| Repository | TicketPriceRepository.java    | Database access for default prices by ticket type                            |
| Model      | Movie.java                    | Defines `Movie` entity                                                       |
| Model      | Booking.java                  | Defines `Booking` entity                                                     |
| Model      | Screening.java                | Defines `Screening` entity                                                   |
| Model      | Seat.java                     | Defines `Seat` entity                                                        |
| Model      | Showroom.java                 | Defines `Showroom` entity                                                    |
| Model      | Review.java                   | Defines `Review` entity                                                      |
| Model      | Address.java                  | Defines `Address` entity                                                     |
| Model      | PaymentCard.java              | Defines `PaymentCard` entity with encryption logic                           |
| Model      | Customer.java                 | Defines `Customer` entity                                                    |
| Model      | Admin.java                    | Defines `Admin` entity                                                       |
| Model      | Promotion.java                | Defines `Promotion` entity with promo codes, discounts, and expiration       |
| Model      | Ticket.java                   | Defines `Ticket` entity with type, price, and booking association            |
| Model      | TicketPrice.java              | Defines default price for each `TicketType`                                  |
| Enum       | MPAARating.java               | Enum for MPAA ratings                                                        |
| Enum       | Role.java                     | Enum for user roles (Admin, Customer)                                        |
| Enum       | Status.java                   | Enum for customer statuses                                                   |
| Enum       | TicketType.java               | Enum for ticket types (Adult, Senior, Child)                                 |
| Util       | EncryptionUtil.java           | Handles encryption & decryption logic                                        |
| Util       | VerificationUtil.java         | Generates verification codes                                                 |
| Util       | VerificationCodeStore.java    | Stores temporary verification codes                                          |
| Util       | PasswordResetCodeStore.java   | Stores temporary password reset codes                                        |

---

The project follows a layered architecture pattern with clear separation of concerns, heavily influenced by the Model-View-Controller (MVC) style common in Spring Boot web applications. Each major responsibility is encapsulated in its own layer:

Model layer contains the @Entity classes (e.g., Movie, Booking, Ticket) that map to database tables.

Repository layer abstracts and encapsulates the database access using Spring Data JPA.

Service layer implements core business logic (e.g., validating ticket prices, handling bookings, calculating fees).

Controller layer serves as the web API entry point (e.g., REST endpoints for bookings, movies, customers).

Utility classes (like EncryptionUtil or EmailService) act as helper components for cross-cutting concerns.

---

Design Patterns Used:
MVC (Model-View-Controller): The controller handles HTTP requests and responses, services hold business logic, and models represent the data.

DAO (Data Access Object) via Repository interfaces using Spring Data JPA.

Facade Pattern: The service layer acts as a facade, providing a simplified interface for controllers to interact with complex underlying logic.

Proxy Pattern: Classes like EmailService may act as proxies for sending emails through external SMTP services (e.g., JavaMailSender), shielding the core logic from implementation specifics.

Singleton Pattern: Spring beans (e.g., services, repositories) are singletons by default.

The system is a Spring-powered layered/MVC hybrid architecture, leveraging a modular, scalable, and loosely coupled design using standard enterprise patterns for maintainability and clarity.



Spring Boot automatically scans these components and connects them.

---

# API Endpoints & Usage
I personally use this software called Postman which allows me to test endpoints by making requests without the frontend. I\'m sure
the frontend environment you guys use has something built in for this already, but just a suggestion for quick, lightweight testing while that
works when only the backend is running!

done

## This backend provides REST API endpoints to interact with movies, reviews, addresses, customers, and payment cards.

### 🎬 Movies Endpoints
| Method     | Endpoint                              | Request Body (if needed)                                     | Description                             |
|------------|---------------------------------------|--------------------------------------------------------------|-----------------------------------------|
| **GET**    | `/api/movies`                         | None                                                         | Fetches all movies                      |
| **GET**    | `/api/movies/{id}`                    | None                                                         | Fetches a specific movie by ID          |
| **GET**    | `/api/movies/search/title/{title}`    | None                                                         | Fetches movies by title                 |
| **GET**    | `/api/movies/search/genre/{genre}`    | None                                                         | Fetches movies by genre                 |
| **GET**    | `/api/movies/search/cast/{cast}`      | None                                                         | Fetches movies by cast member           |
| **GET**    | `/api/movies/search/director/{director}` | None                                                      | Fetches movies by director              |
| **GET**    | `/api/movies/search/producer/{producer}` | None                                                      | Fetches movies by producer              |
| **GET**    | `/api/movies/search/rating/{mpaa}`    | None                                                         | Fetches movies by MPAA rating           |
| **GET**    | `/api/movies/search`                  | Query params: `?title=Inception&genre=Action&mpaa=PG-13`     | Flexible search by any combination      |
| **POST**   | `/api/movies`                         | `{ "title": "Movie", "genre": "Action Epic", "cast": "Actor Names", "director": "Director Names", "producer": "Producer Names", "synopsis": "Brief description of the movie", "picture": "image_path", "video": "youtube link", "mpaa": "PG-13" }`      | Adds a new movie                        |
| **PUT**    | `/api/movies/{id}`                    | `{ "title": "Updated Movie Title", "genre": "Comedy", "cast": "New Actor Names", "director": "New Directors", "producer": "New Producers", "synopsis": "Updated description", "picture": "image_path", "video": "updated_trailer.mp4", "mpaa": "R" }`            | Updates an existing movie               |
| **DELETE** | `/api/movies/{id}`                    | None                                                         | Deletes a movie                         |

For anything that has a request body for movies, all of them are optional meaning you can include or not include them in the request body 
and then will simply be ignored if not included. It is very important that when setting an MPAA rating that you stick to {G, PG, PG13,
R, NC17} exactly as shown here as the Enum is very strict about this. You must also make sure when adding multiple cast members, directors,
and/or producers for any one movie that you list them out under their respective attribute as such "Jacob Cromer, Maria Khambati" where each
name is separated by a comma and a space ", " as that is how they are passed to create arrays of people to be queried later.

### 📝 Reviews Endpoints
| Method     | Endpoint                              | Request Body (if needed)                                     | Description                             |
|------------|---------------------------------------|--------------------------------------------------------------|-----------------------------------------|
| **GET**    | `/api/movies/{id}/reviews`           | None                                                         | Fetches all reviews for a movie by ID   |
| **GET**    | `/api/movies/search/reviews`         | Query params: `?title=Inception`                             | Fetches all reviews for a movie by title |
| **POST**   | `/api/reviews/movie/{id}`            | `{ "reviewerName": "John", "rating": 5, "comment": "Great movie!" }` | Adds a review for a movie by ID |
| **POST**   | `/api/reviews/movie/title/{title}`   | `{ "reviewerName": "John", "rating": 5, "comment": "Great movie!" }` | Adds a review for a movie by title |
| **DELETE** | `/api/reviews/{id}`                  | None                                                         | Deletes a review for a movie by review ID |

The review endpoints are rather self explanatory. None of the three parameters can be left out when creating a review, and rating must be an integer between 1 and 5.
Whatever movie you want to add a review for, you must make sure you include its title or ID in the URL depending on which endpoint you are using.

### 📍 Addresses Endpoints
| Method     | Endpoint               | Request Body (if needed)  | Description                     |
|------------|------------------------|---------------------------|---------------------------------|
| **GET**    | `/api/addresses`       | None                      | Fetches all addresses          	|
| **GET**    | `/api/addresses/{id}`  | None                      | Fetches an address by ID        |
| **DELETE**    | `/api/addresses/{id}`| None                     | Deletes an address by ID        |

I believe the address endpoints are a little unecessary, but they are there should you need them for any reason. These can also be accessed through a GET request on
a specific customer.


### 💳 Payment Card Endpoints
| Method     | Endpoint                                   | Request Body (if needed)                                          | Description                                   |
|------------|--------------------------------------------|-------------------------------------------------------------------|-----------------------------------------------|
| **GET**    | `/api/payment-cards`                       | None                                                              | Fetches all payment cards                     |
| **GET**    | `/api/payment-cards/{id}`                  | None                                                              | Fetches a specific payment card by ID         |
| **GET**    | `/api/payment-cards/customer/{id}`         | None                                                              | Fetches all payment cards for a specific customer ID|
| **POST**   | `/api/payment-cards/customer/{customerId}` | `{ "decryptedCardNumber": "1234567812345678", "expirationDate": "2026-12-31", "decryptedCvv": "123" }` | Adds a new card using the customer's registered address |
| **PUT**   | `/api/payment-cards/{id}` | `{"paymentCard": { "decryptedCardNumber": "1234567812345678", "decryptedCvv": "123", "expirationDate": "2026-12-31" }, "billingAddress": { "street": "123 Main St", "city": "New York",
"state": "NY", "zipCode": "10001", "country": "USA"} }` | Updates an existing card by ID. |
| **POST**   | `/api/payment-cards/customer/{customerId}/new-address` | `{ "paymentCard": { "decryptedCardNumber": "9876543210987654", "expirationDate": "2025-11-30", "decryptedCvv": "456" }, "billingAddress": { "street": "456 Elm St", "city": "Los Angeles", "state": "CA", "zipCode": "90001", "country": "USA" } }` | Adds a new payment card with a new billing address |
| **DELETE** | `/api/payment-cards/{id}`                  | None                                                              | Deletes a payment card by ID                  |
| **GET**    | `/api/payment-cards/{id}/decrypt-card`     | None                                                              | Retrieves the decrypted card number (seccure use only) |
ure use only) |
| **GET**    | `/api/payment-cards/{id}/decrypt-cvv`      | None                                                              | Retrieves the decrypted CVV (se
Payment cards can be a little strict as well. Make sure that you keep card numbers at 16 digits and CVVs at 3. They allow for a little more than that actually, but that was just 
a safety measure. You will receive an error message (not an uncaught error) if you try and insert a card to a customer that already has 3, as that is one of the requirements of the
project. Again, this will not crash the system, but it will notify you if you try it. Lastly, for the dates we are using a specific library that expects this date format of
YYYY-MM-DD so please stick to that religiously. States can hold more characters than two but for consistency, let\'s stick to the two-letter representation and just keep all payment
country values as 'USA'

You can see there are two different POST endpoints here. One allows you to add a card to a customer using their address attribute as the billing address, and the other asks you
to specify one. Be aware of the slightly different structures of the request bodies for these two endpoints. The cards also manage addresses well by checking to make sure that
the address doesn\'t already exist in the database. If so, it will just grab its address ID and use that, so no need to worry about that.

### 📝 Customer Endpoints
| Method     | Endpoint                                      | Request Body (if needed)                                            | Description                                   |
| **POST**   | /api/customers                                | `{ "firstName": "John", "lastName": "Doe", "email": "john@example.com", "decryptedPassword": "password123", "role" : "ACTIVE", "isSubscriber": true, "address": { "street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA" }`                                           | Creates a new customer                                  |
| **GET**     | /api/customers                               | None                                            | Fetches all customers                                  | 
| **GET**     | /api/customers/{id}                          | None                                            | Fetches a customer by ID                               | 
| **GET**     | /api/customers/email/{email}                 | None                                            | Fetches a customer by email                            |
| **PUT**     | /api/customers/{id}                          | `{ "firstName": "John", "lastName": "Smith", "decryptedPassword": "newpass", "isSubscriber": false, "status": "INACTIVE", "address": { "street": "456 Elm St", "city": "Los Angeles", "state": "CA", "zipCode": "90001", "country": "USA" } }`                                  | Updates customer details (besides email)               | 
| **DELETE**  | /api/customers/{id}                          | None                                            | Deletes a customer by ID                               | 
| **DELETE**  | /api/customers/email/{email}                 | None                                            | Deletes a customer by email                            | 

Customers and admins are likely the most important endpoints here. When creating a customer with a POST request, all of the above attributes and values are completely necessary 
other than role. Role is defaultly set to ACTIVE if you don\'t specify but will accept (and only accept) {ACTIVE, INACTIVE, SUSPENDED}. Also, don\'t bother trying to
set status. It is also defaulty set and any attempts to change it will not work. The system also automatically handles
duplicate email addresses, so if you try and insert a duplicate email (checking admin and customer) it will give you an error response. When updating a customer, all of the attributes, again,
are unecessary. You can include or leave out any of them you wish to (if you update an address, I would always update the full address) Pulling a customer will give you all of 
their personal info, an array of payment cards, and some attributes of when they were last updated, when they were created, last login, and last logout as well. You do not ever have
to update these last four as those are completely managed by the system and just for record keeping. Deleting a customer will also delete all of their payment cards.

### 📝 Admin Endpoints

| Method     | Endpoint                                      | Request Body (if needed)                                            | Description                                   |
| **POST**   | /api/admins                                   | { "firstName": "Admin", "lastName": "User", "email": "admin@example.com", "decryptedPassword": "securepassword" }                                          | Creates a new admin                                  |
| **GET**     | /api/admins                                  | None                                            | Fetches all admins                            | 
| **GET**     | /api/admins/{id}                             | None                                            | Fetches an admin by ID                        |  
| **GET**     | /api/admins/email/{email}                    | None                                            | Fetches an admin be email                     | 
| **PUT**     | /api/admins/{id}                             | { "firstName": "Admin", "lastName": "Updated", "decryptedPassword": "newsecurepassword" }                                           | Updates admin details (besides email)                          | 
| **DELETE**  | /api/admins/{id}                             | None                                            | Deletes an admin by ID                        | 
| **DELETE**  | /api/admins/email/{email}                    | None                                            | Deletes an admin by email                     | 


The admin table is basically the exact same as the customer table with a couple less attributes. The only real reason they exist as separate tables is to not have a bunch
of null values for admin rows in a user table. The role attribute for customers and admins serves as like a badge for different user types. We will work out logging in/registration
kinks very soon.

### 🛂 Registration, Verification, and Login/Logout Endpoints
| Method     | Endpoint                                      | Request Body (if needed)                                            | Description                                   |
|------------|---------------------------------------------|-------------------------------------------------------------------|-----------------------------------------------|
| **POST**   | `/api/customers/send-verification`         | `{ "email": "user@example.com" }`                                 | Sends a verification code to the provided email|
| **POST**   | `/api/customers/verify`                    | `{ "email": "user@example.com", "code": "123456" }`               | Verifies the provided code for the given email |
| **POST**   | `/api/customers/login`                     | `{ "email": "user@example.com", "password": "SecurePass123!" }`   | Logs in a customer, updates `lastLoggedIn`, activates inactive users, and prevents suspended users from logging in |
| **POST**   | `/api/customers/logout/{customerId}`       | None                                                              | Logs out the customer and updates `lastLoggedOut` |
| **POST**   | `/api/customers/forgot-password`           | `{ "email": "user@example.com" }`                                 | Sends a password reset code to the email |
| **POST**   | `/api/customers/reset-password`            | `{ "email": "user@example.com", "code": "123456", "newPassword": "NewSecurePass456!" }` | Resets the password using the provided reset code |
| **POST**   | `/api/customers/change-password`           | `{ "email": "user@example.com", "oldPassword": "SecurePass123!", "newPassword": "NewSecurePass456!" }` | Changes the customer\'s password after validating the old password |

The general idea for registering a customer is that you allow them to put in all of their information including an address (which is optional in the POST request for customers too) 
and then you maintain a JSON variable/object on the front end of that information. Before creating the customer with POST, you will use send-verification and await the verification code
which is also contained in the response of send-verification just in case. Then you will use the email from the JSON customer variable you created (or pulling from the input fields if 
they're still up. However you want to do it). And then once you have a successful call to verify, then you can create the customer using POST. Keep in mind that a customer is allowed to
enter payment cards at registration but you can not POST a customer with payment cards. So you will have to POST the customer, and then POST the payment cards to that customer ID afterwards.
Logging in really only serves to verify the username and password. Once a customer has a successful call to login, you should then hold on to their email so that you can reference it to GET
the customer and their information wherever you may need it. Logging in will set any INACTIVE customer to ACTIVE, and will not permit a SUSPENDED customer to log in. Forgot-password and reset-password
work almost the same as registering. You should allow the customer to say they forgot their password and give you their email to send them a code, and then wait for them to give you back the code
to use with their email and a new password to reset their password. Then once you have a succesful call to reset-password, they should be able to log in again. Change-password works very similarly,
except you will want to take in their email, oldpassword, and a newpassword. All error handling and edge cases should be accounted for, but please test them and try to break them to your heart\'s content.
Logging really only updates the customer\'s lastLoggedOut, but should be called whenever you click log out and bring a user back to the home page. Keep in mind, these api endpoints also exist
for admins. I am leaving it up to your discretion how you want to handle this as it's not completely necessary, but my suggestion would be to use them for admins too and just make sure that admin logging
in and out and registering is done on separate admin forms and gatekeeping admin registration behind an admin registration code/password as we have already been doing because the basic POST call
for an admin will also work for a customer.

### 🎟️ Promotions Endpoints
| Method     | Endpoint                                      | Request Body (if needed)                                           | Description                                   |
|------------|---------------------------------------------|-------------------------------------------------------------------|-----------------------------------------------|
| **POST**   | `/api/promotions`                          | `{ "promoCode": "SAVE10", "description": "Get 10% off all tickets!", "discountPercentage": 10.00, "expirationDate": "2025-12-31" }` | Creates a new promotion and sends an email to all subscribed customers |
| **GET**    | `/api/promotions/{id}`                     | None                                                              | Fetches a promotion by its ID                 |
| **GET**    | `/api/promotions`                          | None                                                              | Fetches all promotions                        |
| **GET**    | `/api/promotions/code/{code}`              | None                                                              | Fetches a promotion by code                   |
| **PUT**    | `/api/promotions/{id}`                     | `{ "description": "Updated discount for the holidays!", "discountPercentage": 15.00, "expirationDate": "2025-12-31" }` | Updates an existing promotion (excluding the promo code) |
| **DELETE** | `/api/promotions/{id}`                     | None                                                              | Deletes a promotion by ID                     |

Lastly are the promotions endpoints. These are very simple and I doubt you need them at this point but they are here. Keep in mind that discountPercentage must stay in this
form between 0.00 and 100.00 explicitly with the decimal places. This value represents the percentage of the discount where 10.00, for example, is 10\% off the entire price.
Expiration date should also maintain this "YYYY-MM-DD" format as to not introduce any typing errors, and promo code is limited to four characters and that is strictly enforced
in the backend. Please keep them to four-character strings of upper case letters and numbers for consistency. As well, this will send an email to every user subscribed to promotional emails.
Please keep in mind that this is hooked up to my email for right now lol. Gmail\'s free SMTP sends limit us to 500 emails a day, which should be more than enough. I am considering
creating a free gmail account for our project that way it doesn\'t come from jacobcromer@gmail.com and something like CinemaEBookingSystem@gmail.com or something like that.

### Showroom Endpoints
| Method | Endpoint                  | Description                 | Request Body (if needed)   |
|--------|---------------------------|-----------------------------|----------------------------|
| GET    | /api/showrooms            | Get all showrooms           | None                       |
| GET    | /api/showrooms/{id}       | Get showroom by ID          | None                       |
| POST   | /api/showrooms            | Create a new showroom       | { "seatCapacity": 30 }     |
| DELETE | /api/showrooms/{id}       | Delete showroom by ID       | None                       |

Honestly, you should not ever need to use these. They exist just in case, but shouldn\'t be necessary.

### Seat Endpoints
| Method | Endpoint                            | Description                   | Request Body (if needed)                      |
|--------|-------------------------------------|-------------------------------|-----------------------------------------------|
| GET    | /api/seats                          | Get all seats                 | None                                          |
| GET    | /api/seats/{id}                     | Get seat by ID                | None                                          |
| GET    | /api/seats/showroom/{showroomId}    | Get all seats for a showroom  | None                                          |
| POST   | /api/seats/showroom/{showroomId}    | Add a seat to a showroom      | { "seatNumber": "1-1", "rowNumber": 1,        |
|        |                                     |                               |   "columnNumber": 1 }                         |
| DELETE | /api/seats/{id}                     | Delete seat by ID             | None                                          |

Again, these seat endpoints exist for convenience, but should not be used. No part of the project depends on our ability to create new theaters
or add or remove seats from them, etc. It can be done, but there is no logic to enforce constraints of seat number to seat capacity, etc. Just don\t, lol.

### Screening Endpoints
| Method | Endpoint                                               | Description                                                 | Request Body (if needed)                                |
|--------|--------------------------------------------------------|-------------------------------------------------------------+---------------------------------------------------------|
| GET    | /api/screenings                                        | Get all screenings                                          | None                                                    |
| GET    | /api/screenings/{id}                                   | Get screening by ID                                         | None                                                    |
| GET    | /api/screenings/movie/id/{movieId}                     | Get all screenings for a movie by ID                        | None                                                    |
| GET    | /api/screenings/movie/title/{title}                    | Get all screenings for a movie by title (case-insensitive)  | None                                                    |
| GET    | /api/screenings/date/{yyyy-MM-dd}                      | Get all screenings for a specific date                      | None                                                    |
| GET    | /api/screenings/available/{yyyy-MM-dd}                 | Get available showtimes per showroom (with booked movies)   | None                                                    |
| POST   | /api/screenings/movie/{movieId}/showroom/{showroomId}  | Create a screening                                          | { "showtime": "2025-04-05T18:30:00" }                   |
| DELETE | /api/screenings/{id}                                   | Delete a screening by ID                                    | None                                                    |

Okay, above you can get all the screenings, get a specific screening, get all screenings for a movie by movie ID and title, and get all screenings for a specific date.
Getting available showtimes is really nice as it shows what times are available on a specific date for each showroom, and it also shows you what movies are already booked at what time in
each showroom. This is what you can use to help you choose times that you can schedule a movie at a certain date.

The endpoints do not allow any overlap in showtime and showroom, which means no two movies can be played at the same place at the same time. You can also delete screenings as well.

### Booking Endpoints
| Method | Endpoint                                                      | Description                                                | Request Body (if needed)                                    |
|--------|---------------------------------------------------------------|------------------------------------------------------------|-------------------------------------------------------------|
| GET    | /api/bookings                                                 | Get all bookings                                           | None                                                        |
| GET    | /api/bookings/{id}                                            | Get a booking by its ID                                    | None                                                        |
| GET    | /api/bookings/customer/{customerId}                           | Get all bookings for a specific customer                   | None                                                        |
| POST   | /api/bookings/customer/{customerId}/card/{cardId}?promoId=X   | Create a new booking with optional promo code              | None/Optional                                               |
| DELETE | /api/bookings/{id}                                            | Delete a booking by its ID                                 | None                                                        |
| PUT    | /api/bookings/{id}/send-confirmation-email                    | Send booking confirmation email                            | None                                                        |
| PUT    | /api/bookings/{id}/refund                                     | Refund a booking (sets isRefunded to true)                 | None                                                        |

Here are all the endpoints for creating bookings. You can see they contain a customer, date created, a list of tickets, and pricing information. Creating a booking is separate than creating tickets.
Think of it like you have to create a box to put stuff in. You make a booking which acts as a single location to group tickets together. So create a booking for a customer, and then fill it with tickets
sequentially. And then after creating a booking, then you want to send the confirmation email explicitly. Typically this is all handled in one request like logging in or something, but creating the 
confirmation email is lowkey complicated so I thought it best and simplest to understand if they are kept separate. The flow then for this is create booking, create tickets for a booking, and then 
send confirmation email once all of that is done!

Refunding a booking is there because it\'s a requirement but it has no real functionality other than sending a refund email and setting isRefunded to true. Just allows a customer to decide to do this
if they want.

### Ticket Endpoints
| Method | Endpoint                                                    | Description                                              | Request Body (if needed)                                |
|--------|-------------------------------------------------------------|----------------------------------------------------------|---------------------------------------------------------|
| GET    | /api/tickets                                                | Get all tickets                                          | None                                                    |
| GET    | /api/tickets/{id}                                           | Get a specific ticket by its ID                          | None                                                    |
| GET    | /api/tickets/booking/{bookingId}                            | Get all tickets for a given booking                      | None                                                    |
| POST   | /api/tickets/booking/{bookingId}/seat/{seatId}/screening/{screeningId} | Create a ticket for a specific booking/seat/screening   | { "ticketType": "Adult" }                     |
| DELETE | /api/tickets/{id}                                           | Delete a ticket by ID                                    | None                                                    |

Here, the main endpoint is obviously creating tickets. This has to be done after creating a booking to hold them. Keep in mind that once you create a booking, create and add tickets, and then send
the confirmation email, that is it. There is no updating the booking or adding/deleting tickets from the booking. Thats it. So make sure that you add all tickets necessary to the booking before you are done.
Deleting tickets does not delete them from a booking. There really is no reason to delete a ticket explicitly. All tickets will be deleted as a function of database logic on their own if you delete
a booking. So again, create booking, create tickets, send confirmation, leave it alone.

### Ticket Pricing Endpoints

| Method | Endpoint                               | Description                                                | Request Body (if needed)                                |
|--------|----------------------------------------|------------------------------------------------------------|---------------------------------------------------------|
| GET    | /api/ticket-prices                     | Get all current ticket prices                              | None                                                    |
| PUT    | /api/ticket-prices/{type}?newPrice=X   | Update the price of a given ticket type                    | None                                                    |
| GET    | /api/ticket-prices/online-fee          | Get the current online booking fee                         | None                                                    |
| PUT    | /api/ticket-prices/online-fee?newFee=X | Update the online booking fee                              | None                                                    |
| POST   | /api/ticket-prices/calculate-prices    | Update the online booking fee                              | { "ticketPrices": [12.00, 8.00, 6.00], "promoCode": "SPRING20" } |

Here are endpoints that allow you to control pricings. You can update the price of Adult, Senior, or Child tickets using this like /Child?newprice=5.00 for example. You can also
do the same thing with online fees, which is just a flat rate applied to all bookings.

---

# Summary
Run everything together:
./start_project.sh

Stop everything:
./stop_project.sh (closing the frontend and backend terminals should also work)

Run backend manually:
mvn clean install 
java -jar target/movieapp-0.0.1-SNAPSHOT.jar

Run frontend manually:
npm install (only once)
npm run dev

(note if you are using my version of the scripts, I am emulating a Linux terminal on a Windows machine. That means in some cases 
	I have to use Linux commands that emulate Windows commands (I know), so you may have to configure the scripts slightly for use 
	on an actual Linux machine or for MacOS. If that is the case, please create separate scripts if you must and call them start/stop_project_mac.sh 
	that way when we continue sharing in the future, both options are always there!)

---

Given that the project was refactored in Linux terminal and not IntelliJ, I am no longer using JDBC/ConnecterJ. 
That means you no longer need these and instead all dependencies are handled by Maven, which automatically factors in dependencies (in pom.xml) 
and builds/compiles the project freshly each time using mvn clean install. For SpringBoot, no installations are necessary. 
However, you will have to install Apache Maven to run the backend. Unfortunately this is the easiest way for a big backend project like this, 
but installation is quick and easy.

Just download Maven from the official Apache Maven site.

You can check the installation using:
mvn -version which should give you a similar output to the following:


Apache Maven 3.9.9 (8e8579a9e76f7d015ee5ec7bfcdc97d260186937)
Maven home: C:\Program Files\Apache\apache-maven-3.9.9
Java version: 17.0.4, vendor: Oracle Corporation, runtime: C:\Program Files\Java\jdk-17.0.4
Default locale: en_US, platform encoding: Cp1252
OS name: "windows 10", version: "10.0", arch: "amd64", family: "windows"

Keep in mind this project is running in Java 17, specifically 17.0.4.

Anyone in the frontend running the project should already have node.js installed but can check with:
node -v
npm -v













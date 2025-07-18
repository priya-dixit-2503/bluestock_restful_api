
# Project Name- IPO Web Application & REST API Development


##  Project Description

**IPO Web Application & REST API Development** is a full-stack web platform built using React for the frontend and Django for the backend. It allows users to register, log in, and securely manage information about Initial Public Offerings (IPOs). The application includes user authentication (via JWT), data validation, and a fully functional RESTful API to perform CRUD operations on IPO entries.

This project is ideal for learning modern web development practices including secure token-based authentication, API integration with React, pagination, and error handling.

Key components:
- IPO listing with pagination
- Secure authentication system (JWT)
- REST API using Django REST Framework
- Interactive React frontend with real-time API integration

 
# Software Requirements-

Backend-
- SDK: Python (Version 3.12.3)
- Framework: Django (Version 5.0.6) - `pip install Django`
- API: Django REST Framework (Version 3.15.1) - `pip install djangorestframework`
- Tools: Postman for API testing, Git & GitHub for version control

Frontend-
- Technologies: HTML, CSS, plain JavaScript (no NodeJS)
- Framework: Bootstrap 5 (via CDN link)
- Database: PostgreSQL
- IDE: Visual Studio Code (VS Code)


# How to Start django server

  1. Create virtual environment
  python -m venv myenv

  2. Activate environment
  .\myenv\Scripts\activate.ps1   # (For PowerShell)

  3. Navigate to backend
  cd backend

  4. Install dependencies
  pip install -r requirements.txt

  5. Go To Your Project
  cd ipo_project

  6. Run migrations
  python manage.py migrate

  7. Start server
  python manage.py runserver

  Starting development server at http://127.0.0.1:8000/

# How to start frontend server
  1. Navigate to frontend
  cd frontend

  2. Start the React server
  npm start

  Open your default browser to http://localhost:3000/   



# Apis-


1. Get All IPOs

     Method: GET
     URL: http://127.0.0.1:8000/api/ipo/
     Description: Retrieve a list of all IPOs.
     Authentication: Required (JWT)
     ![Get](api_screenshots/GET_IPO_LIST.png)

2. Create New IPO

    Method: POST
    URL: http://127.0.0.1:8000/api/ipo/
    Description: Create a new IPO entry.
    Authentication: Required
    Request Body (JSON): 
    ![Post](api_screenshots/POST_IPO_LIST.png)

    {
  "id": 1,
  "company_name": "TechWave55 Solutions Ltd.",
  "company_logo": "https://example.com/logo.png",
  "ipos": [
    {
      "id": 1,
      "price_band": "₹100 - ₹120",
      "open_date": "2025-06-10",
      "close_date": "2025-06-13",
      "issue_size": "₹500 Cr",
      "issue_type": "Book Built Issue",
      "listing_date": "2025-06-20",
      "status": "Listed",
      "ipo_price": 120.00,
      "listing_price": 135.00,
      "listing_gain": 12.50,
      "current_market_price": 142.00,
      "current_return": 18.33,
      "documents": [
        {
          "id": 1,
          "rhp_pdf": "https://example.com/rhp.pdf",
          "drhp_pdf": "https://example.com/drhp.pdf"
        }
      ]
    }
  ]
}   

3. Get IPO by ID

    Method: GET
    URL: http://127.0.0.1:8000/api/ipo/{id}
    Description: Get details of a specific IPO by its ID.
    Authentication: Required
    ![Get with id](api_screenshots/GET_API.png)


4. Update IPO by ID

    Method: PUT
    URL: http://127.0.0.1:8000/api/ipo/{id}
    Description: Update an existing IPO's details.
    Authentication: Required
    ![put](api_screenshots/PUT_API.png)
    Request Body (JSON):

   - After update-

    {
    "id": 24,
    "company_name": "TechWave55 Solutions Ltd.",
    "company_logo": "https://example.com/logo.png",
    "ipos": [
        {
            "id": 22,
            "price_band": "₹100 - ₹120",
            "open_date": "2025-06-10",
            "close_date": "2025-06-13",
            "issue_size": "₹5000 Cr",         # I have updated 500 Cr to 5000 Cr.
            "issue_type": "Book Built Issue",
            "listing_date": "2025-06-20",
            "status": "Listed",
            "ipo_price": "120.00",
            "listing_price": "135.00",
            "listing_gain": "12.50",
            "current_market_price": "142.00",
            "current_return": "18.33",
            "documents": [
                {
                    "id": 36,
                    "rhp_pdf": "https://example.com/rhp.pdf",
                    "drhp_pdf": "https://example.com/drhp.pdf"
                }
            ]
        }
    ]
}


5. Delete IPO by ID

    Method: PUT
    URL: http://127.0.0.1:8000/api/ipo/{id}
    Description: Delete an existing IPO's details.
    Authentication: Required
    ![Delete](api_screenshots/DELETE_API.png)


6. Get All Companies
     Method: Get
     URL:http://127.0.0.1:8000/api/companies/
     Description: Returns a list of all available companies.
     Response:
   [
  {
    "id": 1,
    "company_name": "TCS",
    "company_logo": "https://example.com/logo.png"
  },
  {
    "id": 2,
    "company_name": "Infosys",
    "company_logo": "https://example.com/logo2.png"
  }
]
   
   ![companies](api_screenshots/GET_COMP.jpeg)

8. User Signup
   Method: Post
   URL: http://127.0.0.1:8000/api/signup/
   Description: Log in an existing user and get JWT tokens.
   Request Body:
   {
  "email": "user@example.com",
  "password": "yourpassword",
  "confirm_password": "yourpassword"
}

![signup](api_screenshots/SIGN_UP.jpeg)


8. User Login
   Method: Post
   URL: http://127.0.0.1:8000/api/login/
   Description: Log in an existing user and get JWT tokens.
   Request Body:
   {
  "email": "user@example.com",
  "password": "yourpassword"
}

![login](api_screenshots/LOGIN.jpeg)


9. Token Refresh
    Method: PUT
   URL: http://127.0.0.1:8000/api/token/refresh/
   Description: Get a new access token using the refresh token.
   Request Body:
   {
  "refresh": "<your-refresh-token>"
}

![token refresh](api_screenshots/REFRESH_TOKEN.jpeg)


10. User Logout
    Method: Post
    URL: http://127.0.0.1:8000/api/logout/
    Description: Logout the user and blacklist the refresh token.
    Headers:
    Authorization: Bearer <your-refresh-token>



![logout](api_screenshots/LOGOUT.jpeg)

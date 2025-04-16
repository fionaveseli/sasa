# SASA Tournament System API Testing Guide

> **Note:** This documentation is for the production environment hosted at `https://web-production-3dd4c.up.railway.app/api`

## Environment Setup

1. Create a new environment in Postman:

   - Click "Environments" in sidebar
   - Click "+"
   - Name: "SASA Tournament"
   - Add variables:
     ```
     base_url: https://web-production-3dd4c.up.railway.app/api
     token: (leave empty initially)
     ```

2. Create a new Collection:
   - Name: "SASA Tournament System"
   - Set Authorization:
     - Type: Bearer Token
     - Token: {{token}}

## Testing Flow

### 1. User Registration and Authentication

#### 1.1 Register Admin User (Required for University Creation)

```
Method: POST
URL: {{base_url}}/auth/register
Headers:
  Content-Type: application/json
Body:
{
    "fullName": "Admin User",
    "email": "admin@sasa.com",
    "password": "password123",
    "role": "admin", //default Student role
    "graduationYear": 2024,
    "timeZone": "UTC"
}
Expected Response: 201 Created
```

#### 1.2 Login as Admin

```
Method: POST
URL: {{base_url}}/auth/login
Headers:
  Content-Type: application/json
Body:
{
    "email": "admin@sasa.com",
    "password": "password123"
}
Expected Response: 200 OK
Important: Copy the token from response and set it as environment variable 'token'
```

#### 1.3 Register University Manager

```
Method: POST
URL: {{base_url}}/auth/register
Headers:
  Content-Type: application/json
Body:
{
    "fullName": "John Manager",
    "email": "manager@university.com",
    "password": "password123",
    "role": "university_manager",
    "graduationYear": 2024,
    "timeZone": "UTC"
}
Expected Response: 201 Created
```

#### 1.4 Login as University Manager

```
Method: POST
URL: {{base_url}}/auth/login
Headers:
  Content-Type: application/json
Body:
{
    "email": "manager@university.com",
    "password": "password123"
}
Expected Response: 200 OK
Important: Copy the token from response and set it as environment variable 'token'
```

### 2. University Management

#### 2.1 Create University

```
Method: POST
URL: {{base_url}}/uni/universities-r
Headers:
  Content-Type: application/json
Body:
{
    "name": "Test University",
    "email_domain": "university.edu",
    "location": "Test Location",
    "contact_info": "123456789",
    "logo": "https://example.com/logo.png",
    "banner_color": "#FF0000",
    "bio": "Test university bio"
}
Expected Response: 201 Created
Save the university_id from response
```

#### 2.2 Get Universities List

```
Method: GET
URL: {{base_url}}/uni/universities-g
Expected Response: 200 OK
```

### 3. Student Management

#### 3.1 Register Student

```
Method: POST
URL: {{base_url}}/auth/register
Headers:
  Content-Type: application/json
Body:
{
    "fullName": "John Student",
    "email": "student@university.edu",
    "password": "password123",
    "role": "student",
    "graduationYear": 2024,
    "timeZone": "UTC",
    "university_id": 1
}
Expected Response: 201 Created
```

#### 3.2 Login as Student

```
Method: POST
URL: {{base_url}}/auth/login
Body:
{
    "email": "student@university.edu",
    "password": "password123"
}
Expected Response: 200 OK
Important: Update the token environment variable with new token
```

### 4. Team Management

#### 4.1 Create Team

```
Method: POST
URL: {{base_url}}/teams
Body:
{
    "name": "Test Team",
    "university_id": 1
}
Expected Response: 201 Created
Save the team_id from response
```

#### 4.2 Get University Teams

```
Method: GET
URL: {{base_url}}/university/1/teams
Expected Response: 200 OK
```

### 5. Tournament Management

#### 5.1 Create Tournament (Login as University Manager first)

```
Method: POST
URL: {{base_url}}/tournaments
Body:
{
    "name": "Test Tournament",
    "type": "university",
    "registration_deadline": "2024-04-01T00:00:00Z",
    "start_date": "2024-04-15T00:00:00Z",
    "end_date": "2024-04-30T00:00:00Z",
    "university_id": 1,
    "bracket_type": "single_elimination",
    "description": "Test tournament description",
    "rules": "Tournament rules here",
    "time_zone": "UTC"
}
Expected Response: 201 Created
Save the tournament_id from response
```

#### 5.2 Get Tournaments

```
Method: GET
URL: {{base_url}}/tournaments
Optional Query Parameters: ?type=university&status=registration_open&university_id=1
Expected Response: 200 OK
```

#### 5.3 Update Tournament Status

```
Method: PATCH
URL: {{base_url}}/tournaments/1/status
Body:
{
    "status": "registration_open"
}
Expected Response: 200 OK
```

### 6. Team Registration

#### 6.1 Register Team for Tournament (Login as Student)

```
Method: POST
URL: {{base_url}}/tournaments/1/register
Body:
{
    "team_id": 1
}
Expected Response: 200 OK
```

### 7. Match Management

#### 7.1 Get Tournament Matches

```
Method: GET
URL: {{base_url}}/tournaments/1/matches
Expected Response: 200 OK
```

#### 7.2 Submit Match Score

```
Method: POST
URL: {{base_url}}/matches/1/scores
Body:
{
    "score_value": 10,
    "proof_image_url": "https://example.com/proof.jpg"
}
Expected Response: 201 Created
```

### 8. Voting System

#### 8.1 Submit Vote

```
Method: POST
URL: {{base_url}}/tournaments/1/vote
Body:
{
    "team_id": 1
}
Expected Response: 201 Created
```

#### 8.2 Get Tournament Votes

```
Method: GET
URL: {{base_url}}/tournaments/1/votes
Expected Response: 200 OK
```

## Important Notes

1. **Authentication**:

   - All endpoints except registration and login require authentication
   - Token is automatically included if you've set up collection authorization
   - Token expires after 24 hours

2. **Role Requirements**:

   - University creation: Admin only
   - Tournament creation: University Manager only
   - Team creation: Students only
   - Score submission: Team members only
   - Score dispute resolution: University Manager or Admin only

3. **Testing Order**:

   - Follow the steps in order as many operations depend on previous ones
   - Keep track of IDs returned in responses
   - Update the token when switching between users

4. **Common Issues**:

   - 401: Token missing or invalid
   - 403: Insufficient permissions
   - 404: Resource not found
   - 400: Invalid request data

5. **Environment Variables**:
   - base_url: https://web-production-3dd4c.up.railway.app/api
   - token: (Updated after each login)

## Postman Collection Setup

1. **Import Collection**:

   - Open Postman
   - Click "Import" button
   - Create a new request for each endpoint above
   - Save all requests in the "SASA Tournament System" collection

2. **Set Collection Authorization**:

   - Click on the collection
   - Go to "Authorization" tab
   - Type: Bearer Token
   - Token: {{token}}
   - This will automatically add the token to all requests in the collection

3. **Testing Workflow**:
   - Start with user registration
   - Login to get token
   - Token will automatically be used for subsequent requests
   - Switch between users (Manager/Student) as needed for different operations

## Example Direct URLs

For direct API access without using Postman variables, use the following URL format:

```
# Authentication
https://web-production-3dd4c.up.railway.app/api/auth/register
https://web-production-3dd4c.up.railway.app/api/auth/login

# University Management
https://web-production-3dd4c.up.railway.app/api/uni/universities-r
https://web-production-3dd4c.up.railway.app/api/uni/universities-g

# Team Management
https://web-production-3dd4c.up.railway.app/api/teams
https://web-production-3dd4c.up.railway.app/api/university/1/teams

# Tournament Management
https://web-production-3dd4c.up.railway.app/api/tournaments
https://web-production-3dd4c.up.railway.app/api/tournaments/1/status
https://web-production-3dd4c.up.railway.app/api/tournaments/1/register
https://web-production-3dd4c.up.railway.app/api/tournaments/1/matches
https://web-production-3dd4c.up.railway.app/api/tournaments/1/vote
https://web-production-3dd4c.up.railway.app/api/tournaments/1/votes

# Match Management
https://web-production-3dd4c.up.railway.app/api/matches/1/scores
```

Remember to include the appropriate authorization headers and request bodies as specified in the documentation above.

# API Contract

This document defines the API contract used by the frontend.

- Source of truth: src/api/*
- All services return `response.data`
- Backend must match this contract exactly
- Authenticated routes use Bearer token via axios interceptor

Last updated: April 2026

---

## AUTH

### POST /auth/login
Body:
{ "email": "string", "password": "string" }

Response:
{ "user": { ... }, "token": "string" }

---

### POST /auth/register
Body:
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "graduationYear": "number",
  "timeZone": "string",
  "role": "string (optional)"
}

Response:
{ ... }

---

### POST /auth/change-password
Body:
{ "currentPassword": "string", "newPassword": "string" }

Response:
{ ... }

---

## USERS

### GET /users/me
Response:
{
  "user": {
    "id": "number",
    "fullName": "string",
    "email": "string",
    "role": "string",
    "universityId": "string",
    "graduationYear": "number"
  }
}

---

### PATCH /users/profile
Body:
{ "fullName": "string", "graduationYear": "string" }

---

### PATCH /users/:id/role
Body:
{ "role": "string" }

---

### PATCH /users/me
Body:
{ "universityId": "string" }

Response:
{ "user": { ... } }

---

### GET /universities/:id/users
Response:
{ "users": [] }

---

## UNIVERSITIES

### GET /universities
Response:
{ "universities": [] }

---

### POST /universities
Body:
{
  "universityName": "string",
  "universityAddress": "string",
  "contactNumber": "string",
  "logo": "string (optional)",
  "bannerColor": "string",
  "bio": "string"
}

---

### GET /universities/:id/teams
Response:
{ "teams": [] }

---

### GET /universities/:id/tournaments
Response:
{ "tournaments": [] }

---

## TEAMS

### POST /teams
Body:
{
  "name": "string",
  "bio": "string (optional)",
  "logo": "string (optional)",
  "universityId": "number"
}

---

### POST /teams/:id/join
### POST /teams/:id/leave
### DELETE /teams/:id

---

## TOURNAMENTS

### GET /tournaments
Response:
{ "tournaments": [] }

---

### POST /tournaments
Body:
{
  "name": "string",
  "type": "string",
  "registration_deadline": "string",
  "start_date": "string",
  "end_date": "string",
  "universityId": "number",
  "bracket_type": "string",
  "description": "string",
  "rules": "string",
  "time_zone": "string"
}

---

### GET /tournaments/:id/matches
Response:
[
  {
    "id": "number",
    "team1": {},
    "team2": {},
    "scores": []
  }
]

---

### GET /tournaments/:id/votes
Response:
[
  {
    "team_id": "number",
    "team_name": "string",
    "votes": "number"
  }
]

---

## MATCHES

### POST /matches/:id/scores
Body:
{ "score_value": "number", "proof_image_url": "string" }

---

### PATCH /matches/:id/status
Body:
{ "status": "string" }

---

### PATCH /matches/:id/resolve
Body:
{ "winner_team_id": "number" }

---

## UPLOADS

### POST /upload/logo
Response:
{ "file": { "url": "string" } }

---

## SEARCH

### GET /search
Query:
query: string
type?: string

Response:
{ ... }

---

## NOTES

- Confirm `/users/all` and `/universities/:id/transfer-manager`

# Desktop API (Profile + Blog + Auth)

Base URL (dev): `/api/`

## Auth

### POST `/api/login/`
- Request:
```json
{ "username": "alice", "password": "secret" }
```
- Response:
```json
{ "access": "jwt", "refresh": "jwt", "username": "alice" }
```

### POST `/api/register/`
- Request:
```json
{ "username": "alice", "email": "a@example.com", "password": "secret123" }
```

### POST `/api/token/refresh/`
- Request:
```json
{ "refresh": "jwt" }
```

## Blog

### GET `/api/posts/`
- Returns published posts:
```json
[
  {
    "slug": "hello-world",
    "title": "Hello World",
    "summary": "short intro",
    "date": "2026-03-27T12:00:00Z"
  }
]
```

### GET `/api/posts/<slug>/`
- Returns post detail:
```json
{
  "slug": "hello-world",
  "title": "Hello World",
  "summary": "short intro",
  "contentMarkdown": "# content",
  "date": "2026-03-27T12:00:00Z"
}
```

## Planned profile sync endpoints

### GET `/api/profile/`
Return desktop preference:
- `display_name`
- `avatar_url`
- `theme_accent_hue`
- `wallpaper_id`

### PUT `/api/profile/`
Update desktop preference.

### POST `/api/profile/avatar/`
Upload avatar (`multipart/form-data`, field: `avatar`).


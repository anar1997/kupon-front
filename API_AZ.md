# Kuponum API Sənədi (AZ)

Bu sənəd hazırda mövcud olan backend API-ləri haqqında qısa və aydın məlumat verir. Frontend komandası üçün nəzərdə tutulub.

- Baza URL: `/api/`
- Swagger: `/api/docs/swagger/`
- ReDoc: `/api/docs/redoc/`
- OpenAPI schema: `/api/schema/`
- JSON cavablar UTF-8

## Autentifikasiya

- JWT istifadə olunur.
- Login: `POST /api/users/login/` (email, password)
- Token yeniləmə: `POST /api/users/login/refresh/` (refresh)
- Qorunan endpointlərdə `Authorization: Bearer <access_token>` header-i göndərin.

Nümunə cavab (login):

```
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

## İstifadəçilər (Users)

Prefix: `/api/users/`

### 1) İstifadəçi siyahısı
- Method: GET
- URL: `/api/users/`
- İcazə: Hal-hazırda açıq (AllowAny)
- Filter parametrləri:
  - `email` (exact və ya `email__icontains` üçün `?email__icontains=...`)
  - `is_guest` (exact, məsələn `?is_guest=false`)
  - `region` (exact, region id)
  - `referred_by` (exact, user id)

Nümunə:
- `GET /api/users/?email__icontains=@gmail.com&region=1`

Cavab (User obyektinin sahələri):
```
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Ad",
  "last_name": "Soyad",
  "phone": "+994501112233",
  "referral_code": "ABCD1234",
  "referred_by": 5,            // varsa, refer edən istifadəçinin id-si
  "is_guest": false,
  "region": 1,                 // Region id
  "date_joined": "2025-08-14T10:00:00Z",
  "last_login": "2025-08-14T11:00:00Z"
}
```

### 2) İstifadəçi əlavə et
- Method: POST
- URL: `/api/users/`
- İcazə: Açıq (AllowAny)
- Body sahələri:
  - `first_name` (string, optional)
  - `last_name` (string, optional)
  - `email` (string, required, unikal)
  - `phone` (string, optional, unikal; boş gəlirsə saxlanmır)
  - `region` (integer, optional, region id)
  - `password` (string, required, min 6)
  - `referred_by_code` (string, optional; mövcud referral koda uyğundursa qəbul edilir)

Nümunə request:
```
POST /api/users/
Content-Type: application/json

{
  "first_name": "Abbas",
  "last_name": "Quliyev",
  "email": "abbas@example.com",
  "phone": "+994501234567",
  "region": 1,
  "password": "secret12",
  "referred_by_code": "ABCD1234"
}
```

Nümunə uğurlu cavab:
```
{
  "detail": "Əməliyyat yerinə yetirildi"
}
```

Mümkün validasiya xətaları (400):
```
{
  "email": ["Bu email ilə istifadəçi artıq mövcuddur."],
  "phone": ["Bu telefon nömrəsi artıq qeydiyyatdadır."],
  "referred_by_code": ["Yanlış referal kod"]
}
```

Qeyd:
- `referral_code` server tərəfindən avtomatik yaradılır və unikal olur.
- Telefon boş/blank gəldikdə saxlanmır (NULL), beləliklə unikal konflikt yaratmır.

### 3) İstifadəçi detallarını gətir
- Method: GET
- URL: `/api/users/{id}/`
- İcazə: Öz profili və ya admin (IsSelfOrAdmin)

### 4) İstifadəçini yenilə
- Method: PUT
- URL: `/api/users/{id}/`
- İcazə: Öz profili və ya admin (IsSelfOrAdmin)
- Body sahələri:
  - `first_name`, `last_name`, `phone`, `region`

Uğurlu cavab:
```
{
  "detail": "Əməliyyat yerinə yetirildi"
}
```

### 5) Mən (hazırkı istifadəçi)
- Method: GET
- URL: `/api/users/me/`
- İcazə: Auth lazım (Bearer token)
- Cavab: `UserSerializer` sahələri (yuxarıda göstərilib)

### 6) Şifrəni dəyiş
- Method: POST
- URL: `/api/users/change_password/`
- İcazə: Auth lazım (Bearer token)
- Body sahələri:
  - `old_password` (string, required)
  - `new_password` (string, required, min 6)

Uğurlu cavab:
```
{
  "detail": "Şifrə uğurla dəyişdirildi"
}
```

Mümkün xətalar (400):
```
{
  "old_password": ["Old password is incorrect."],
  "new_password": ["New password must be at least 6 characters long."]
}
```

## Login (JWT)

### Access token əldə et
- Method: POST
- URL: `/api/users/login/`
- Body:
```
{
  "email": "abbas@example.com",  // Sistem email-lə giriş üçün konfiqurasiya olunub
  "password": "secret12"
}
```
- Cavab: `{"refresh": "...", "access": "..."}`

### Access token-i yenilə
- Method: POST
- URL: `/api/users/login/refresh/`
- Body:
```
{
  "refresh": "<refresh_token>"
}
```

## Regionlar (Regions)

Prefix: `/api/regions/`

### 1) Region siyahısı
- Method: GET
- URL: `/api/regions/`
- İcazə: Açıq (default)
- Filter parametrləri:
  - `name__icontains` (məs: `?name__icontains=Baku`)
  - `parent` (exact id, məsələn `?parent=1`)

Cavab (siyahı):
```
[
  {"id": 1, "name": "Bakı", "parent": null},
  {"id": 2, "name": "Xətai", "parent": 1}
]
```

### 2) Region əlavə et
- Method: POST
- URL: `/api/regions/`
- İcazə: Admin (IsAdminUser)
- Body:
```
{
  "name": "Yasamal",
  "parent": 1   // optional
}
```

### 3) Region detalı
- Method: GET
- URL: `/api/regions/{id}/`
- İcazə: Açıq (default)

### 4) Region yenilə
- Method: PUT
- URL: `/api/regions/{id}/`
- İcazə: Admin (IsAdminUser)

### 5) Region sil
- Method: DELETE
- URL: `/api/regions/{id}/`
- İcazə: Admin (IsAdminUser)

## Qeydlər və məsləhətlər

- Bütün tarixlər ISO 8601 formatındadır (UTC, məsələn `2025-08-14T10:00:00Z`).
- `Authorization` header-i yalnız qorunan endpointlərdə tələb olunur.
- Telefon nömrəsi üçün frontend-də mümkün qədər E.164 formatı istifadə edin (məsələn `+994501234567`).
- `referred_by_code` yalnız mövcud referral koda bərabərdirsə qəbul ediləcək.
- Swagger səhifəsindən bütün endpointləri interaktiv yoxlamaq mümkündür: `/api/docs/swagger/`.

## Tipik Xəta Cavabları

- 400 (Validation error):
```
{
  "field": ["xəta mesajı"],
  "another_field": ["başqa xəta"]
}
```
- 401 (Unauthorized):
```
{
  "detail": "Authentication credentials were not provided."
}
```
- 403 (Forbidden):
```
{
  "detail": "You do not have permission to perform this action."
}
```
- 404 (Not found):
```
{
  "detail": "Not found."
}
```

---
Bu sənəd kod bazasındakı hazırkı endpointlərə əsasən hazırlanıb. Dəyişiklik olarsa, Swagger sənədləri həmişə ən son vəziyyəti əks etdirəcək.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Auth (Account)](#auth-account)
4. [Products](#products)
5. [Categories](#categories)
6. [Tables](#tables)
7. [Orders](#orders)
8. [Order Items](#order-items)
9. [Employees](#employees)
10. [Images](#images)

---

## Overview

All requests go through a single entry point: `index.php` with query parameters.

| Parameter  | Description                                 |
| ---------- | ------------------------------------------- |
| `resource` | The resource name (e.g. `product`, `order`) |
| `action`   | Sub-action (e.g. `login`, `pay`)            |
| `id`       | Resource ID for single-item operations      |
| `token`    | Session token for authenticated routes      |

### Response Format

**Success:**

```json
{
  "status": "success",
  "message": "Success",
  "data": { ... }
}
```

**Error:**

```json
{
  "status": "error",
  "message": "Error description"
}
```

### Content Types

- **Form data:** `multipart/form-data` or `application/x-www-form-urlencoded`
- **JSON body:** `application/json` (auto-parsed into `$_POST`)
- **File uploads:** `multipart/form-data` with field name `images`

### Method Override

For environments that only support GET/POST, send `_method=PUT` or `_method=DELETE` as a POST field.

---

## Authentication

Protected endpoints require a **session token** passed as `token` (query param or POST field).

Tokens are obtained via:

- `?resource=auth&action=login` (account-based)
- `?resource=employee&action=login` (employee-based)

Tokens expire after 30 days by default.

> 🔒 **Protected** routes are marked with a lock icon below.

---

## Auth (Account)

### Login

```
POST ?resource=auth&action=login
```

| Field          | Type   | Required | Default |
| -------------- | ------ | -------- | ------- |
| `username`     | string | ✅       |         |
| `password`     | string | ✅       |         |
| `expired_days` | int    | ❌       | 30      |

**Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "id": 1,
    "username": "admin",
    "session_token": "abc123...",
    "session_expired": "2026-03-16"
  }
}
```

### Register

```
POST ?resource=auth&action=register
```

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `username` | string | ✅       |
| `password` | string | ✅       |

---

## Products

### List All Products

```
GET ?resource=product
```

**Response:** `data` → `Product[]`

### Get Single Product

```
GET ?resource=product&id={id}
```

**Response:** `data` → `Product`

### Create Product 🔒

```
POST ?resource=product
```

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| `name`        | string | ✅       |
| `sku`         | string | ✅       |
| `description` | string | ❌       |
| `price`       | double | ✅       |
| `category`    | int    | ✅       |
| `isAvailable` | int    | ❌       |
| `images`      | File   | ❌       |
| `token`       | string | ✅       |

### Update Product 🔒

```
POST ?resource=product&id={id}   (with _method=PUT)
```

Same fields as create (all optional). Include `images` file to replace the image.

### Delete Product 🔒

```
DELETE ?resource=product&id={id}&token={token}
```

---

## Categories

### List All Categories

```
GET ?resource=category
```

### Get Single Category

```
GET ?resource=category&id={id}
```

### Create Category 🔒

```
POST ?resource=category
```

| Field    | Type   | Required |
| -------- | ------ | -------- |
| `name`   | string | ✅       |
| `images` | File   | ❌       |
| `token`  | string | ✅       |

### Update Category 🔒

```
POST ?resource=category&id={id}   (with _method=PUT)
```

### Delete Category 🔒

```
DELETE ?resource=category&id={id}&token={token}
```

---

## Tables

### List All Tables

```
GET ?resource=table
```

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": 1,
      "capacity": 4,
      "status": "AVAILABLE",
      "createdAt": "2026-02-14 10:00:00",
      "updatedAt": "2026-02-14 10:00:00"
    }
  ]
}
```

### Update Table Status 🔒

```
POST ?resource=table&id={id}   (with _method=PUT)
```

| Field    | Type   | Required | Values                              |
| -------- | ------ | -------- | ----------------------------------- |
| `status` | string | ✅       | `AVAILABLE`, `OCCUPIED`, `RESERVED` |
| `token`  | string | ✅       |                                     |

---

## Orders

### List All Orders

```
GET ?resource=order
GET ?resource=order&status=NEW          ← filter by status
```

**Response:** `data` → `Order[]` (includes `tableName`)

### Get Single Order

```
GET ?resource=order&id={id}
```

**Response:** `data` → `Order` with nested `items[]` (includes `productName`, `sku`)

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "orderNumber": "ORD-20260214-0001",
    "tableId": 1,
    "tableName": 1,
    "customerName": "John",
    "status": "NEW",
    "subtotal": 50000,
    "tax": 5500,
    "total": 55500,
    "isPaid": 0,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Nasi Goreng",
        "sku": "NG001",
        "quantity": 2,
        "price": 25000,
        "subtotal": 50000,
        "notes": null
      }
    ]
  }
}
```

### Create Order 🔒

```
POST ?resource=order
```

| Field                 | Type   | Required | Notes                    |
| --------------------- | ------ | -------- | ------------------------ |
| `tableId`             | int    | ✅       |                          |
| `customerName`        | string | ❌       |                          |
| `notes`               | string | ❌       |                          |
| `servedBy`            | int    | ❌       | Employee ID              |
| `items[0][productId]` | int    | ✅       | At least 1 item required |
| `items[0][quantity]`  | int    | ✅       |                          |
| `items[0][notes]`     | string | ❌       |                          |
| `token`               | string | ✅       |                          |

**JSON body example:**

```json
{
  "tableId": 1,
  "customerName": "John",
  "token": "abc123...",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1, "notes": "extra spicy" }
  ]
}
```

**Business rules:**

- `orderNumber` auto-generated as `ORD-YYYYMMDD-XXXX`
- `price` is snapshot from products table at creation time
- `subtotal`, `tax` (11%), `total` calculated server-side
- Table status auto-set to `OCCUPIED`

### Update Order Status 🔒

```
POST ?resource=order&id={id}   (with _method=PUT)
```

| Field    | Type   | Required | Values                                       |
| -------- | ------ | -------- | -------------------------------------------- |
| `status` | string | ✅       | `NEW`, `PENDING`, `CONFIRMED`, `IN_PROGRESS` |
| `token`  | string | ✅       |                                              |

### Pay Order 🔒

```
POST ?resource=order&action=pay&id={id}
```

| Field           | Type   | Required | Notes                |
| --------------- | ------ | -------- | -------------------- |
| `paymentMethod` | string | ✅       | `CASH` or `QRIS`     |
| `cashReceived`  | double | ⚠️       | Required when `CASH` |
| `token`         | string | ✅       |                      |

**Business rules:**

- `cashReceived` must be ≥ `total` for CASH payments
- `change` calculated automatically
- `completedAt` set to current time
- `isPaid` set to `1`
- Table status auto-reset to `AVAILABLE`

**Response:**

```json
{
  "status": "success",
  "message": "Payment successful",
  "data": {
    "id": 1,
    "paymentMethod": "CASH",
    "cashReceived": 100000,
    "change": 44500,
    "isPaid": true
  }
}
```

---

## Order Items

### Add Item to Order 🔒

```
POST ?resource=order-item
```

| Field       | Type   | Required |
| ----------- | ------ | -------- |
| `orderId`   | int    | ✅       |
| `productId` | int    | ✅       |
| `quantity`  | int    | ✅       |
| `notes`     | string | ❌       |
| `token`     | string | ✅       |

**Note:** `price` is copied from the products table automatically. Parent order totals are recalculated.

### Update Order Item 🔒

```
POST ?resource=order-item&id={id}   (with _method=PUT)
```

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `quantity` | int    | ❌       |
| `notes`    | string | ❌       |
| `token`    | string | ✅       |

### Delete Order Item 🔒

```
DELETE ?resource=order-item&id={id}&token={token}
```

Parent order totals are recalculated after deletion.

---

## Employees

### Login (Public)

```
POST ?resource=employee&action=login
```

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | ✅       |
| `password` | string | ✅       |

**Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@pos.com",
    "role": "ADMIN",
    "session_token": "abc123...",
    "session_expired": "2026-03-16"
  }
}
```

### List All Employees 🔒

```
GET ?resource=employee&token={token}
```

**Note:** Password field is excluded from the response.

### Get Single Employee 🔒

```
GET ?resource=employee&id={id}&token={token}
```

### Create Employee 🔒

```
POST ?resource=employee
```

| Field      | Type   | Required | Values                                  |
| ---------- | ------ | -------- | --------------------------------------- |
| `name`     | string | ✅       |                                         |
| `email`    | string | ✅       | Must be unique                          |
| `password` | string | ✅       | Stored as bcrypt hash                   |
| `role`     | string | ✅       | `ADMIN`, `SERVER`, `CASHIER`, `KITCHEN` |
| `phone`    | string | ❌       |                                         |
| `token`    | string | ✅       |                                         |

---

## Images

### List All Images

```
GET ?resource=image
```

### Upload Image 🔒

```
POST ?resource=image
```

| Field     | Type   | Required |
| --------- | ------ | -------- |
| `images`  | File   | ✅       |
| `altText` | string | ❌       |
| `token`   | string | ✅       |

**Response:**

```json
{
  "status": "success",
  "message": "Image uploaded successfully",
  "data": {
    "id": 1,
    "url": "67abcd1234_photo.jpg",
    "altText": "Product photo"
  }
}
```

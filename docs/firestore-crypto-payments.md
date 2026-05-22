# Firestore: pagos crypto visa (QR Solana Pay)

Estructura para checkout invitado, sesiones QR pendientes y comprobantes pagados consultables por email o fecha.

## Colecciones

| Ruta | Propósito |
|------|-----------|
| `visaCryptoSessions/{sessionId}` | Sesión de checkout (guest). Índice ligero por email. |
| `visaCryptoSessions/{sessionId}/paymentRequests/{requestId}` | Solicitud QR: `pending` → `paid` \| `expired`. |
| `visaCryptoComprobantes/{requestId}` | Comprobante pagado (doc id = `requestId`). Consultas admin. |

Las rutas y tipos viven en `src/lib/payments/firestore-schema.ts`. Escritura vía Firebase Admin en `/api/payments/qr/*`.

## Consultas típicas

```text
// Comprobantes por email (requiere índice billingEmail + paidAt)
visaCryptoComprobantes
  .where('billingEmail', '==', 'cliente@ejemplo.com')
  .orderBy('paidAt', 'desc')

// Comprobantes recientes
visaCryptoComprobantes.orderBy('paidAt', 'desc').limit(50)

// Recuperar QR de una sesión
visaCryptoSessions/{sessionId}/paymentRequests
  .where('status', 'in', ['pending', 'expired'])
```

## Ejemplo: sesión

```json
{
  "sessionId": "sess_abc123",
  "billingEmail": "maria@ejemplo.com",
  "lastPlanId": "premium",
  "lastRequestId": "req_xyz789",
  "lastPaidAt": "2026-05-22T18:40:12.000Z",
  "createdAt": "2026-05-22T18:30:00.000Z",
  "updatedAt": "2026-05-22T18:40:12.000Z"
}
```

## Ejemplo: paymentRequest (pendiente)

```json
{
  "requestId": "req_xyz789",
  "sessionId": "sess_abc123",
  "planId": "premium",
  "paymentMethod": "usdc",
  "status": "pending",
  "recipientWallet": "Ao8RqGikw3joMDo25nb3s3c7WcP6ouazJJnA1twirDAT",
  "reference": "8xK2...referencePubkey",
  "qrUrl": "solana:...",
  "planPriceUSD": 3500,
  "chargeUSD": 3500,
  "expectedAmountUi": "3500",
  "expectedAmountRaw": "3500000000",
  "tokenDecimals": 6,
  "tokenMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "billingData": { "email": "maria@ejemplo.com", "fullName": "María López", "...": "..." },
  "billingEmail": "maria@ejemplo.com",
  "createdAt": "2026-05-22T18:30:05.000Z",
  "updatedAt": "2026-05-22T18:30:05.000Z",
  "expiresAt": "2026-05-22T19:30:05.000Z"
}
```

## Ejemplo: comprobante (pagado)

```json
{
  "comprobanteId": "req_xyz789",
  "requestId": "req_xyz789",
  "sessionId": "sess_abc123",
  "orderId": "req_xyz789",
  "status": "paid",
  "planId": "premium",
  "paymentMethod": "usdc",
  "transactionSignature": "5Kp9...solanaTxSignature",
  "payerWallet": "7nBm...phantomWallet",
  "tokenMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "tokenLabel": "USDC",
  "expectedAmountUi": "3500",
  "expectedAmountRaw": "3500000000",
  "tokenDecimals": 6,
  "chargeUSD": 3500,
  "planPriceUSD": 3500,
  "billingData": { "email": "maria@ejemplo.com", "fullName": "María López", "...": "..." },
  "billingEmail": "maria@ejemplo.com",
  "billingPhone": "+5215512345678",
  "billingFullName": "María López",
  "recipientWallet": "Ao8RqGikw3joMDo25nb3s3c7WcP6ouazJJnA1twirDAT",
  "reference": "8xK2...referencePubkey",
  "qrUrl": "solana:...",
  "createdAt": "2026-05-22T18:30:05.000Z",
  "paidAt": "2026-05-22T18:40:12.000Z",
  "updatedAt": "2026-05-22T18:40:12.000Z"
}
```

## Migración desde rutas antiguas

| Antes | Ahora |
|-------|-------|
| `visaOrders/{sessionId}/paymentRequests/{requestId}` | `visaCryptoSessions/{sessionId}/paymentRequests/{requestId}` |
| `visaOrders/{sessionId}/orders/{requestId}` | `visaCryptoComprobantes/{requestId}` |

## Seguridad

Ver `firestore.rules`: sesiones y `paymentRequests` sin acceso cliente; comprobantes solo lectura para usuarios autenticados (panel admin). Las API usan Admin SDK y no dependen de estas reglas para escribir.

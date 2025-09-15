# DV Net TypeScript Client

TypeScript SDK for DV Net API - a comprehensive solution for merchant integration with blockchain payment processing.

## Extended Documentation

See `https://docs.dv.net/` for full API reference and integration guides.

## Installation

```bash
npm install @dv.net/js-client
yarn add @dv.net/js-client
```

## Usage

### Basic Setup

```typescript
import { MerchantClient } from "@dv.net/js-client";

const client = new MerchantClient({
  xApiKey: 'your-api-key',
  host: 'https://api.example.com'
});
```

## API Methods

### Get Exchange Balances

```typescript
const balances = await client.getExchangeBalances();
```

### Get External Wallet

```typescript
const wallet = await client.getExternalWallet({
  storeExternalId: 'store-123', // required
  email: 'user@example.com',
  ip: '192.168.1.1',
  amount: '100',
  currency: 'Trx.Tron'
});
```

### Get Processing Wallets Balances

```typescript
const balances = await client.getProcessingWalletsBalances();
```

### Get Store Currencies

```typescript
const currencies = await client.getStoreCurrencies();
```

### Get Store Currency Rate

```typescript
const rate = await client.getStoreCurrencyRate({
  currencyId: 'BTC.Bitcoin'
});
```

### Initialize Transfer

```typescript
const withdrawal = await client.initializeTransfer({
  addressTo: '0x9260004698F0Ba0c8968aF9b2971154A883E7c75',
  currencyId: 'BTC.Bitcoin',
  amount: '50',
  requestId: '1'
});
```

### Get Withdrawal Processing Status

```typescript
const status = await client.getWithdrawalProcessingStatus({
  withdrawalId: '8a6f472c-9b59-419f-a101-07638cedc3fa'
});
```

### Delete Withdrawal from Processing

```typescript
await client.deleteWithdrawalFromProcessing({
  id: '8a6f472c-9b59-419f-a101-07638cedc3fa'
});
```

### Get Hot Wallet Balances

```typescript
const accounts = await client.getHotWalletBalances();
```

## Using with Custom HTTP Client

```typescript
import { MerchantClient, HttpClient } from '@dv.net/js-client';

class CustomHttpClient implements HttpClient {
  async request<T = any>(config: {
    method: string;
    url: string;
    data?: any;
    headers?: Record<string, string>;
  }): Promise<{
    data: T;
    status: number;
    statusText: string;
  }> {
    // Your custom HTTP implementation
    // ...
  }
}

const client = new MerchantClient({
  httpClient: new CustomHttpClient(),
  host: 'https://api.example.com',
  xApiKey: 'your-api-key'
});
```

## Error Handling

The client now surfaces backend errors verbatim. When the API responds with an error, you receive the same shape:

```json
{
  "errors": [
    { "message": "email must be a valid email address", "field": "email" }
  ],
  "code": 422
}
```

For non-backend issues (network, configuration), the client throws a normalized error with the same structure and `code` set to `500`:

```json
{
  "errors": [ { "message": "Network error" } ],
  "code": 500
}
```

Example usage:

```typescript
try {
  const wallet = await client.getExternalWallet({
    storeExternalId: 'store-123',
    email: 'user@example.com'
  });
} catch (error: any) {
  // error has shape: { errors: { message, field? }[], code: number }
  console.error(error);
}
```

## License

MIT

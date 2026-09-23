# DV Net TypeScript Client 🚀

TypeScript SDK for DV Net API - a comprehensive solution for merchant integration with blockchain payment processing.

## Extended Documentation 📚

See `https://docs.dv.net/` for full API reference and integration guides.

## Installation 📦

```bash
npm install @dv.net/js-client
yarn add @dv.net/js-client
```

## Usage 🧩

### Basic Setup ⚙️

```typescript
import { MerchantClient } from "@dv.net/js-client";

const client = new MerchantClient({
  xApiKey: 'your-api-key',
  host: 'https://api.example.com'
});
```

## API Methods 🔌

### Get Exchange Balances 💱

```typescript
const balances = await client.getExchangeBalances();
```

### Get External Wallet 👛

```typescript
const wallet = await client.getExternalWallet({
  storeExternalId: 'store-123', // required
  email: 'user@example.com',
  ip: '192.168.1.1',
  amount: '100',
  currency: 'TRX.Tron'
});
```

### Get Processing Wallets Balances 🏦

```typescript
const balances = await client.getProcessingWalletsBalances();
```

### Get Store Currencies 🛍️

```typescript
const currencies = await client.getStoreCurrencies();
```

### Get Store Currencies Rates 💹

Returns rates for all currencies enabled on the store. `rate` is scale-adjusted; `original_rate` is without store `rate_scale`.

```typescript
const rates = await client.getStoreCurrenciesRates();
// [{ code, rate, original_rate, rate_source }, ...]
```

### Initialize Transfer 💸

```typescript
const withdrawal = await client.initializeTransfer({
  addressTo: 'bc1qql2ch9xrw2v4p5c0pgar2q305yl38erwlv2fjw',
  currencyId: 'BTC.Bitcoin',
  amount: '50',
  requestId: '1'
});
```

### Get Withdrawal Processing Status ⏳

```typescript
const status = await client.getWithdrawalProcessingStatus({
  withdrawalId: '8a6f472c-9b59-419f-a101-07638cedc3fa'
});
```

### Delete Withdrawal from Processing 🗑️

```typescript
await client.deleteWithdrawalFromProcessing({
  id: '8a6f472c-9b59-419f-a101-07638cedc3fa'
});
```

### Get Hot Wallet Balances 🔥

```typescript
const accounts = await client.getHotWalletBalances();
```

## Using with Custom HTTP Client 🛠️

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

## Error Handling ⚠️

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br>

<div align="center">

**Made with ❤️ for the developer community**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dv-net/dv-net-js-client)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/@dv.net/js-client)

</div>

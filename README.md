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

The SDK provides specific exception types for different error scenarios:

```typescript
import {
  DvNetException,
  DvNetNetworkException,
  DvNetServerException,
  DvNetInvalidRequestException,
  DvNetInvalidResponseDataException,
  DvNetUndefinedHostException,
  DvNetUndefinedXApiKeyException
} from '@dv.net/js-client';

try {
  const balances = await client.getExchangeBalances();
} catch (error) {
  if (error instanceof DvNetNetworkException) {
    console.error('Network error:', error.message);
  } else if (error instanceof DvNetServerException) {
    console.error('Server error:', error.message);
  } else if (error instanceof DvNetInvalidRequestException) {
    console.error('Invalid request:', error.message);
  } else {
    console.error('Unknown error:', error.message);
  }
}
```

## License

MIT

// Base types
export type BlockchainType =
    | "BTC.Bitcoin"
    | "BCH.Bitcoincash"
    | "LTC.Litecoin"
    | "TRX.Tron"
    | "USDT.Tron"
    | "ETH.Ethereum"
    | "USDC.Ethereum"
    | "USDT.Ethereum"
    | "LTC.Ethereum"
    | "DAI.Ethereum"
    | "TON.Ethereum"
    | "BNB.BNBSmartChain"
    | "USDT.BNBSmartChain"
    | "USDC.BNBSmartChain"
    | "DAI.BNBSmartChain"
    | "POL.Polygon"
    | "USDT.Polygon"
    | "USDC.Polygon"
    | "DAI.Polygon"
    | "ETH.Arbitrum"
    | "USDT.Arbitrum"
    | "USDC.Arbitrum"
    | "DAI.Arbitrum"
    | "ETH.Optimism"
    | "USDT.Optimism"
    | "USDC.Optimism"
    | "DAI.Optimism"
    | "ETH.Linea"
    | "USDT.Linea"
    | "USDC.Linea"
    | "DAI.Linea"
    | "SOL.Solana"
    | "XMR.Monero"
    | "DOGE.Dogecoin";

export interface Icon {
    icon_128: string;
    icon_512: string;
    icon_svg: string;
}

export interface CurrencyShort {
    id: string;
    code: string;
    name: string;
    blockchain: string;
    precision: number;
    is_bitcoin_like: boolean;
    is_evm_like: boolean;
}

export interface Currency {
    id: string
    code: string
    name: string
    precision: number
    is_fiat: boolean
    blockchain: string
    contract_address: string
    withdrawal_min_balance: string
    has_balance: boolean
    status: boolean
    min_confirmation: number
    icon: Icon
    blockchain_icon: Icon
    explorer_link: string
}

export interface ExchangeBalance {
    amount: string;
    amount_usd: string;
    currency: string;
}

export interface ExchangeBalances {
    totalUsd: string;
    balances: ExchangeBalance[];
}

export interface Address {
    id: string
    wallet_id: string
    user_id: string
    currency_id: string
    blockchain: string
    address: string
    created_at: string
    updated_at: string
    deleted_at: string
    dirty: boolean
}

export interface ExternalWallet {
    address: Address[];
    createdAt: string;
    id: string;
    payUrl: string;
    storeExternalId: string;
    storeId: string;
    updatedAt: string;
    rates: string[];
    amountUsd: string;
}

export interface Asset {
    identity: string;
    amount: string;
    amount_usd: string;
    currency_id: string;
}

export interface Balance {
    native_token: string;
    native_token_usd: string;
}

export interface TronData {
    tron_transfer_data: {
        max_transfers_trc20: string
        max_transfers_native: string
    }
    available_energy_for_use: string
    total_energy: string
    total_bandwidth: string
    stacked_trx: string
    stacked_energy: string
    stacked_bandwidth_trx: string
    stacked_energy_trx: string
    total_used_energy: string
    total_used_bandwidth: string
    available_bandwidth_for_use: string
    stacked_bandwidth: string
}

export interface BlockchainAdditionalData {
    tron_data: TronData;
}

export interface ProcessingWalletBalance {
    address: string;
    blockchain: string;
    currency: CurrencyShort;
    balance: Balance;
    assets: Asset[];
    additional_data?: BlockchainAdditionalData;
}

export interface CurrencyRate {
    code: string;
    rate: string;
    rateSource: string;
}

export interface Transfer {
    kind: string;
    stage: string;
    status: string;
    message: string
}

export interface ProcessingWithdrawal {
    addressFrom: string;
    addressTo: string;
    amount: string;
    amountUsd: string;
    createdAt: string;
    currencyId: string;
    storeId: string;
    transfer?: Transfer;
    txHash: string;
}

export interface Withdrawal {
    addressFrom: string;
    addressTo: string;
    amount: string;
    amountUsd: string;
    createdAt: string;
    currencyId: string;
    id: string;
    storeId: string;
    transferId?: string;
}

export interface AccountCurrency {
    id: string,
    code: string,
    name: string,
    blockchain: string,
    sort_order: number
}

export interface Account {
    balance: string;
    balance_usd: string;
    count: number;
    count_with_balance: number;
    currency: AccountCurrency
}

// Response types
export interface TotalExchangeBalanceResponse {
    total_usd: string;
    balances: ExchangeBalance[];
}

export interface ExternalAddressesResponse {
    id: string;
    created_at: string;
    updated_at: string;
    pay_url: string;
    store_id: string;
    store_external_id: string;
    amount_usd: string;
    address: Address[];
    rates: Record<string, string>;
}

export interface CurrencyRateResponse {
    code: string;
    rate: string;
    rate_source: string;
}

export interface ProcessingWithdrawalResponse {
    transfer?: Transfer;
    tx_hash: string,
    store_id: string,
    currency_id: string,
    address_from: string,
    address_to: string,
    amount: string,
    amount_usd: string,
    created_at: string
}

export interface WithdrawalResponse {
    id: string;
    transfer_id: string | null,
    store_id: string,
    currency_id: string,
    address_from: string,
    address_to: string,
    amount: string,
    amount_usd: string,
    created_at: string
}

export interface AccountResponse {
    accounts: Account[];
}

// HTTP Client interface
export interface HttpClient {
    request<T = any>(config: {
        method: string;
        url: string;
        data?: any;
        headers?: Record<string, string>;
    }): Promise<{
        data: T;
        status: number;
        statusText: string;
    }>;
}

// Endpoints configuration
export interface EndpointsConfig {
    exchangeBalances?: string;
    externalWallet?: string;
    processingWalletsBalances?: string;
    storeCurrencies?: string;
    storeCurrencyRate?: string; // template: /api/v1/external/store/currencies/{currencyId}/rate
    withdrawalProcessingStatus?: string; // template: /api/v1/external/withdrawal-from-processing/{withdrawalId}
    initializeTransfer?: string;
    hotWalletBalances?: string;
    deleteWithdrawalFromProcessing?: string; // template: /api/v1/external/withdrawal-from-processing/{id}
}

// Client options
export interface MerchantClientOptions {
    httpClient?: HttpClient;
    host?: string;
    xApiKey?: string;
    endpoints?: EndpointsConfig;
}

// Request parameters for individual methods
export interface GetExternalWalletParams {
    storeExternalId: string;
    email?: string;
    ip?: string;
    amount?: string;
    currency?: string;
    xApiKey?: string;
    host?: string;
    endpoint?: string;
}

export interface InitializeTransferParams {
    addressTo: string;
    currencyId: string;
    amount: string;
    requestId: string;
    xApiKey?: string;
    endpoint?: string;
    host?: string;
}

export interface GetWithdrawalProcessingStatusParams {
    withdrawalId: string;
    endpoint?: string;
    xApiKey?: string;
    host?: string;
}

export interface GetStoreCurrencyRateParams {
    currencyId: BlockchainType;
    xApiKey?: string;
    host?: string;
    endpoint?: string;
}

export interface DeleteWithdrawalFromProcessingParams {
    id: string;
    xApiKey?: string;
    endpoint?: string;
    host?: string;
}

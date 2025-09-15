import {
    MerchantClientOptions,
    EndpointsConfig,
    HttpClient,
    GetExternalWalletParams,
    InitializeTransferParams,
    GetWithdrawalProcessingStatusParams,
    GetStoreCurrencyRateParams,
    DeleteWithdrawalFromProcessingParams,
    TotalExchangeBalanceResponse,
    ExternalAddressesResponse,
    CurrencyRateResponse,
    ProcessingWithdrawalResponse,
    WithdrawalResponse,
    Account,
    ProcessingWalletBalance,
    Currency,
} from './types.js';
import {AxiosHttpClient} from './httpClient.js';
import {
    DvNetException,
    DvNetInvalidResponseDataException,
    DvNetUndefinedHostException,
    DvNetUndefinedXApiKeyException,
} from './exceptions.js';
import { Method } from "axios";

export class MerchantClient {
    private readonly httpClient: HttpClient;
    private readonly host?: string;
    private readonly xApiKey?: string;
    private readonly endpoints: EndpointsConfig;

    private static readonly DEFAULT_ENDPOINTS: EndpointsConfig = {
        exchangeBalances: '/api/v1/external/exchange-balances',
        externalWallet: '/api/v1/external/wallet',
        processingWalletsBalances: '/api/v1/external/processing-wallet-balances',
        storeCurrencies: '/api/v1/external/store/currencies',
        storeCurrencyRate: '/api/v1/external/store/currencies/{currencyId}/rate',
        initializeTransfer: '/api/v1/external/withdrawal-from-processing',
        withdrawalProcessingStatus: '/api/v1/external/withdrawal-from-processing/{withdrawalId}',
        deleteWithdrawalFromProcessing: '/api/v1/external/withdrawal-from-processing/{id}',
        hotWalletBalances: '/api/v1/external/wallet/balance/hot',
    };

    constructor(options: MerchantClientOptions) {
        this.httpClient = options.httpClient || new AxiosHttpClient();
        this.host = options.host;
        this.xApiKey = options.xApiKey;
        this.endpoints = {...MerchantClient.DEFAULT_ENDPOINTS, ...options.endpoints};
    }

    async getExchangeBalances(
        endpoint?: string,
        host?: string,
        xApiKey?: string,
    ): Promise<TotalExchangeBalanceResponse> {
        const [actualHost, actualXApiKey] = this.getActualRequestParams(xApiKey, host);
        const url = endpoint || this.buildUrl(actualHost, 'exchangeBalances');
        return await this.sendRequest('GET', url, undefined, {'x-api-key': actualXApiKey});
    }

    async getExternalWallet(params: GetExternalWalletParams): Promise<ExternalAddressesResponse> {
        const [actualHost, actualXApiKey] = this.getActualRequestParams(params.xApiKey, params.host);
        const requestData = {
            email: params.email,
            ip: params.ip,
            store_external_id: params.storeExternalId,
            amount: params.amount,
            currency: params.currency,
        };
        const filteredData = Object.fromEntries(
            Object.entries(requestData).filter(([_, value]) => value !== undefined)
        );
        const url = params.endpoint || this.buildUrl(actualHost, 'externalWallet');
        return await this.sendRequest(
            'POST',
            url,
            filteredData,
            { 'Content-Type': 'application/json', 'x-api-key': actualXApiKey }
        );
    }

    async getProcessingWalletsBalances(
        endpoint?: string,
        host?: string,
        xApiKey?: string,
    ): Promise<ProcessingWalletBalance[]> {
        const [actualHost, actualXApiKey] = this.getActualRequestParams(xApiKey, host);
        const url = endpoint || this.buildUrl(actualHost, 'processingWalletsBalances');
        return await this.sendRequest('GET', url, undefined, {'x-api-key': actualXApiKey});
    }

    async getStoreCurrencies(
        endpoint?: string,
        host?: string,
        xApiKey?: string,
    ): Promise<Currency[]> {
        const [actualHost, actualXApiKey] = this.getActualRequestParams(xApiKey, host);
        const url = endpoint || this.buildUrl(actualHost, 'storeCurrencies');
        return await this.sendRequest('GET', url, undefined, {'x-api-key': actualXApiKey});
    }

    async getStoreCurrencyRate(params: GetStoreCurrencyRateParams): Promise<CurrencyRateResponse> {
        const [actualHost, actualXApiKey] = this.getActualRequestParams(params.xApiKey, params.host);
        const url = params.endpoint || this.buildUrl(actualHost, 'storeCurrencyRate', {
            currencyId: params.currencyId
        });
        return await this.sendRequest('GET', url, undefined, {'x-api-key': actualXApiKey});
    }

    async initializeTransfer(params: InitializeTransferParams): Promise<WithdrawalResponse> {
        const [actualHost, actualXApiKey] = this.getActualRequestParams(params.xApiKey, params.host);
        const url = params.endpoint || this.buildUrl(actualHost, 'initializeTransfer');
        return await this.sendRequest(
            'POST',
            url,
            {
                address_to: params.addressTo,
                currency_id: params.currencyId,
                amount: params.amount,
                request_id: params.requestId,
            },
            { 'Content-Type': 'application/json', 'x-api-key': actualXApiKey }
        );
    }

    async getWithdrawalProcessingStatus(params: GetWithdrawalProcessingStatusParams): Promise<ProcessingWithdrawalResponse> {
        const [actualHost, actualXApiKey] = this.getActualRequestParams(params.xApiKey, params.host);
        const url = params.endpoint || this.buildUrl(actualHost, 'withdrawalProcessingStatus', {
            withdrawalId: params.withdrawalId
        });
        return await this.sendRequest('GET', url, undefined, {'x-api-key': actualXApiKey});
    }

    async deleteWithdrawalFromProcessing(params: DeleteWithdrawalFromProcessingParams): Promise<void> {
        const [actualHost, actualXApiKey] = this.getActualRequestParams(params.xApiKey, params.host);
        const url = params.endpoint || this.buildUrl(actualHost, 'deleteWithdrawalFromProcessing', {
            id: params.id
        });
        await this.sendRequest('DELETE', url, undefined, {'x-api-key': actualXApiKey});
    }

    async getHotWalletBalances(
        minBalance?: string,
        endpoint?: string,
        host?: string,
        xApiKey?: string,
    ): Promise<Account[]> {
        const [actualHost, actualXApiKey] = this.getActualRequestParams(xApiKey, host);
        const url = endpoint || this.buildUrl(actualHost, 'hotWalletBalances', undefined, { min_balance: minBalance });
        return await this.sendRequest('GET', url, undefined, { 'x-api-key': actualXApiKey });
    }

    private buildUrl(
        host: string,
        endpointKey: keyof EndpointsConfig,
        pathParams?: Record<string, string>,
        queryParams?: Record<string, string | undefined>
    ): string {
        const endpoint = this.endpoints[endpointKey];
        if (!endpoint) {
            throw new Error(`Endpoint ${endpointKey} is not configured`);
        }
        let url = endpoint.startsWith('http') ? endpoint : `${host}${endpoint}`;
        if (pathParams) {
            Object.entries(pathParams).forEach(([key, value]) => {
                url = url.replace(`{${key}}`, value);
            });
        }
        if (queryParams) {
            const searchParams = new URLSearchParams();
            Object.entries(queryParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, value);
                }
            });
            if (Array.from(searchParams).length > 0) {
                url += (url.includes('?') ? '&' : '?') + searchParams.toString();
            }
        }
        return url;
    }

    private async sendRequest(
        method: Method | string,
        uri: string,
        data?: any,
        headers: Record<string, string> = {}
    ): Promise<any> {
        try {
            const response = await this.httpClient.request({
                method,
                url: uri,
                data,
                headers,
            });
            if (!response.data || typeof response.data !== 'object' || !('data' in response.data)) {
                throw new DvNetInvalidResponseDataException('The response does not contain an array of data.');
            }
            return response.data.data;
        } catch (error: any) {
            if (error && error.errors && typeof error.code !== 'undefined') {
                throw error;
            }
            if (error instanceof DvNetException) {
                throw {
                    errors: [{ message: error.message }],
                    code: typeof error.code === 'number' ? error.code : 0,
                };
            }
            throw {
                errors: [{ message: error?.message || 'Unknown error' }],
                code: 0,
            };
        }
    }

    private getActualRequestParams(xApiKey?: string, host?: string): [string, string] {
        const actualHost = host || this.host;
        const actualXApiKey = xApiKey || this.xApiKey;
        if (!actualHost) {
            throw new DvNetUndefinedHostException('Please set host in client, or pass it in parameters');
        }
        if (!actualXApiKey) {
            throw new DvNetUndefinedXApiKeyException('Please set x-api-key in client, or pass it in parameters');
        }
        return [actualHost, actualXApiKey];
    }
}

import {MerchantClient} from './dist/index.js';

// Initialize the merchant client with your API host
const client = new MerchantClient({
    host: 'https://api-go.dv-net.dev',
    xApiKey: "tsaKzSbs7SKa5XHxhJHvMQCz3F4OMkcFPAnOMrQX2MhkzvM17OU6aTp7GwfF10a1",
});


async function example() {
    try {
        // 1) getExchangeBalances
        const balances = await client.getExchangeBalances();
        console.log(balances);

        // // 2) Get external wallet
        // const wallet = await client.getExternalWallet({
        //     storeExternalId: 'store-123',
        // });
        // console.log(wallet);
        //
        // // 3) Get processing wallets balances
        // const processingBalances = await client.getProcessingWalletsBalances();
        // console.log(processingBalances);
        //
        // // 4) Get store currencies
        // const currencies = await client.getStoreCurrencies();
        // console.log(currencies);
        //
        // // 5) Get store currency rate
        // const rate = await client.getStoreCurrencyRate({
        //     currencyId: "BTC.Bitcoin",
        // });
        // console.log(rate);
        //
        // // 6) Initialize transfer
        // const withdrawal = await client.initializeTransfer({
        //     addressTo: '0x9260004698F0Ba0c8968aF9b2971154A883E7c75',
        //     currencyId: 'ETH.Ethereum',
        //     amount: '0.000014',
        //     requestId: '2',
        // });
        // console.log(withdrawal);
        //
        // // 7) Get withdrawal processing status
        // const status = await client.getWithdrawalProcessingStatus({
        //     withdrawalId: 'facda449-b263-45c0-8e37-63ca5d9ab556',
        // });
        // console.log(status);
        //
        // // 8) Delete withdrawal from processing
        // await client.deleteWithdrawalFromProcessing({
        //     id: 'facda449-b263-45c0-8e37-63ca5d9ab556',
        // });
        //
        // // 9) Get hot wallet balances
        // const accounts = await client.getHotWalletBalances();
        // console.log(accounts);

    } catch (error) {
        console.error('Error:', error);
    }
}

// Run example
example();

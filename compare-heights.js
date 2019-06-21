const { ApiPromise, WsProvider } = require('@polkadot/api');
const { registerJoystreamTypes } = require('@joystream/types');

registerJoystreamTypes();

async function main () {
    // First argument to script should be the api endpoint, or localhost if not specified
    const providerUrl = process.argv[2] || 'ws://127.0.0.1:9944';

    // Initialise the provider
    const provider = new WsProvider(providerUrl);

    // Create the API and wait until ready
    const api = await ApiPromise.create(provider);
    const hash = await api.rpc.chain.getFinalizedHead();
    var header = await api.derive.chain.getHeader(`${hash}`);
    console.log(`${header.blockNumber}`)
}

main().catch(console.error).finally(_ => process.exit());
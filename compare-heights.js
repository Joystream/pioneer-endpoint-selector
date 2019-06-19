// types
const { ApiPromise } = require('@polkadot/api');
const util = require('util');
const request = require("request");
const requestPromise = util.promisify(request);

//Import typeReg-istry
const getTypeRegistry = require('@polkadot/types/codec/typeRegistry').default;

const { Enum, EnumType, Struct, Option, Vector } = require ('@polkadot/types/codec');

// const { getTypeRegistry, u32, u64, Bool, Text, BlockNumber, Moment, AccountId, Hash, Balance, Bytes } = require ('@polkadot/types');
const { u32, u64, Bool, Text, BlockNumber, Moment, AccountId, Hash, Balance, Bytes } = require ('@polkadot/types');
const { u8aToString } = require('@polkadot/util');


const { registerJoystreamTypes } = require('@joystream/types');

registerJoystreamTypes();

//const telemetryHeight = process.argv[2];

//console.log(telemetryHeight)

async function main () {
    const api = await ApiPromise.create();
    const hash = await api.rpc.chain.getFinalizedHead();
    var header = await api.derive.chain.getHeader(`${hash}`);
    console.log(`${header.blockNumber}`)
}

main().catch(console.error).finally(_ => process.exit());
# Pioneer Endpoint Selector
This repo contains scripts to dynamically change the endpoint of our hosted [Pioneer](https://github.com/Joystream/apps) in case the node goes down.

## What it does
It first finds the file and the endpoint the hosted `Pioneer` is connected to.

Then, it will scrape the Polkadot hosted [Substrate telemetry](https://github.com/paritytech/substrate-telemetry) and get the tip of `Finalized Block` for Joystream Testnet V2.

It will then use the API to get the `Finalized Block` from the localhost node, and compare heights. If the latter node tip +2 is greater or equal, it will stop. If the endpoint in `Pioneer` is not the same, it will revert back to the equivalent to localhost.

If not, it will move down the list of possible hosted endpoints and replace the endpoint for the API, and check again until it finds a suitable endpoint. It will then replace the endpoint for `Pioneer`.

Finally, the script reverts the API endpoint to localhost so that it will check this first.

## How to use
1. Clone repo in the folder containing Pioneer, should be located in`~/webui`)
2. Install required (additional) dependencies with `./get-dependencies`.
3. Check `./endpoints.sh`, and ensure that the lists are in line with each other, ie. that `endpoints_api[0]` is localhost, and matches the `endpoints_pioneer[0]` wss. The remaining items in the list should be identical.
3. Setup a service running `./endpoints.sh` at a reasonable time interval.

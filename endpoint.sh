#!/bin/bash

# Endpoints
# Sort in order of priority.
# index [0] in endpoints_api should be locahost, and
# index [0] inendpoints_pioneer should hosted URL on same node
endpoints_api=( \
    "ws://127.0.0.1:9944" \
    "wss://testnet.joystream.org/athens/rpc/" \
    "wss://testnet-brasidas.joystream.org/athens/rpc/" \
    "wss://testnet-toto.joystream.org/athens/rpc/" \
)

endpoints_pioneer=( \
    "wss://testnet-rpc.joystream.org/athens/rpc/" \
    "wss://testnet.joystream.org/athens/rpc/" \
    "wss://testnet-brasidas.joystream.org/athens/rpc/" \
    "wss://testnet-toto.joystream.org/athens/rpc/" \
)

# Find right name of "endpoint file" in pioneer
build_endpoint=$(find ~/webui/packages/apps/build -name 'main.*.js')


# Find endpoint in pioneer
for i_p in ${!endpoints_pioneer[@]}
do
    if grep -q ${endpoints_pioneer[$i_p]} "$build_endpoint"
    then
        wss_pioneer="${endpoints_pioneer[$i_p]}"
        wss_pioneer_index="$i_p"
        echo $wss_pioneer
        break
    else
        :
    fi
done

# Test if the node is syncing
telemetry_height=$(node telemetry-block.js)
echo $telemetry_height
wss_height=$(node compare-heights.js $telemetry_height)
let "wss_height += 2"
echo $wss_height
if [ $wss_height -ge $telemetry_height ]
then
    if [ $wss_pioneer_index -eq 0 ]
    then
        :
    else
	      sed -i -e "s#${endpoints_pioneer[$wss_pioneer_index]}#${endpoints_pioneer[0]}#g" $build_endpoint
    fi
else
    for i_a in ${!endpoints_api[@]}
    do
        if [ $i_a == 0 ]
        then
            :
        else
	    echo $i_a
	    echo ${endpoints_api[$i_a - 1]}
            echo ${endpoints_api[$i_a]}
            sed -i -e "s#'${endpoints_api[$i_a - 1]}'#'${endpoints_api[$i_a]}'#g" ~/webui/node_modules/@polkadot/rpc-provider/defaults.js
            sleep 5s
            telemetry_height=$(node telemetry-block.js)
	          sleep 5s
            wss_api_index="$i_a"
            wss_height=$(node compare-heights.js)
            let "wss_height += 2"
	          echo $wss_height
            if [ $wss_height -ge $telemetry_height ]
            then
                wss_pioneer="${endpoints_pioneer[$i_a]}"
                wss_pioneer_index="$i_a"
                sed -i -e "s#${endpoints_pioneer[$i_a - 1]}#${endpoints_pioneer[$i_a]}#g" $build_endpoint
		break
            else
                :
            fi
        fi
    done
fi

sed -i -e "s#'${endpoints_api[$wss_api_index]}'#'${endpoints_api[0]}'#g" ~/webui/node_modules/@polkadot/rpc-provider/defaults.js

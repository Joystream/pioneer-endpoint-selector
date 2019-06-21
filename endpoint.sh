#!/bin/bash

# Endpoints
# Sort in order of priority.
# index [0] should be endpoint of same node
endpoints=( \
    "wss://testnet-rpc.joystream.org/athens/rpc/" \
    "wss://testnet.joystream.org/athens/rpc/" \
    "wss://testnet-brasidas.joystream.org/athens/rpc/" \
    "wss://testnet-toto.joystream.org/athens/rpc/" \
)

# Find right name of "endpoint file" in pioneer
build_endpoint=$(find ~/webui/packages/apps/build -name 'main.*.js')


# Find endpoint in pioneer
for i_p in ${!endpoints[@]}
do
    if grep -q ${endpoints[$i_p]} "$build_endpoint"
    then
        wss_pioneer="${endpoints[$i_p]}"
        wss_pioneer_index="$i_p"
        echo $wss_pioneer
        break
    else
        :
    fi
done

# TODO: if wss_pioneer == '' exit

# Test if the node is syncing
telemetry_height=$(node telemetry-block.js)
echo $telemetry_height
wss_height=$(node compare-heights.js)
let "wss_height += 2"
echo $wss_height
if [ $wss_height -ge $telemetry_height ]
then
    if [ $wss_pioneer_index -eq 0 ]
    then
        :
    else
	      sed -i -e "s#${endpoints[$wss_pioneer_index]}#${endpoints[0]}#g" $build_endpoint
    fi
else
    for i_a in ${!endpoints[@]}
    do
	    echo $i_a
        echo ${endpoints[$i_a]}
        sleep 5s
        telemetry_height=$(node telemetry-block.js)
        sleep 5s
        wss_height=$(node compare-heights.js ${endpoints[$i_a]})
        let "wss_height += 2"
        echo $wss_height
        if [ $wss_height -ge $telemetry_height ]
        then
            sed -i -e "s#${endpoints[$wss_pioneer_index]}#${endpoints[$i_a]}#g" $build_endpoint
            break
        else
            :
        fi
    done
fi

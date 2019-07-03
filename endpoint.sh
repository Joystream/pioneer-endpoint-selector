#!/bin/bash

# Endpoints
# Sort in order of priority.
endpoints=( \
    "wss://testnet.joystream.org/acropolis/rpc/" \
    "wss://testnet-brasidas.joystream.org/acropolis/rpc/" \
    "wss://testnet-rpc.joystream.org/athens/rpc/" \
    "wss://testnet-toto.joystream.org/athens/rpc/" \
)

# Find right name of "endpoint file" in pioneer
build_endpoint=$(find ~/webui/packages/apps/build -name 'main.*.js')

# Get the finalized block for last run:
last_height=$(grep 'var lastHeight = *' 'telemetry-block.js')
last_final_block=${last_height//[!0-9]/}
echo $last_final_block

# Find endpoint in pioneer
for ip in ${!endpoints[@]}
do
    if grep -q ${endpoints[$ip]} "$build_endpoint"
    then
        wss_pioneer="${endpoints[$ip]}"
        wss_pioneer_index="$ip"
        echo $wss_pioneer
        echo $wss_pioneer_index
        break
    else
        :
    fi
done

# Abort script if no endpoint is found:
if [ -z $wss_pioneer ]
then
    echo "fail"
    exit 1
    # Should we build pioneer again here?
fi

# Verify that telemetry is up:
telemetry_height=$(node telemetry-block.js)
echo $telemetry_height

# If telemetry is working:
if [ $telemetry_height -ge $last_final_block ]
then
    ws_height=$(node compare-heights.js)
    let "ws_height += 2"
    echo $ws_height
    if [ $ws_height -ge $telemetry_height ]
    then
        if [ $wss_pioneer_index -eq 0 ]
        then
            :
        else
	        sed -i -e "s#${endpoints[$wss_pioneer_index]}#${endpoints[0]}#g" $build_endpoint
        fi
    sed -i -e "s#$last_height#var lastHeight = $ws_height#g" telemetry-block.js
    else
        for ia in ${!endpoints[@]}
        do
	        echo $ia
            echo ${endpoints[$ia]}
            wss_height=$(node compare-heights.js ${endpoints[$ia]})
            let "wss_height += 2"
            echo $wss_height
            if [ $wss_height -ge $telemetry_height ]
            then
                sed -i -e "s#${endpoints[$wss_pioneer_index]}#${endpoints[$ia]}#g" $build_endpoint
                break
            else
                :
            fi
        done
    sed -i -e "s#$last_height#var lastHeight = $wss_height#g" telemetry-block.js    
    fi

# If telemetry is down:
else
    wss_max=0
    for ia in ${!endpoints[@]}
    do
        echo $ia
        echo ${endpoints[$ia]}
        wss_height=$(node compare-heights.js ${endpoints[$ia]})
        let "wss_max += 1"
        echo $wss_max
        if [ $wss_height -gt $wss_max ]
        then
            wss_max=$wss_height
            echo $wss_max
            index=$ia
            echo $index
        else
            :
        fi
    done
    ws_height=$(node compare-heights.js)
    echo $ws_height
    let "ws_height += ${#endpoints[@]}"
    echo $ws_height
    echo $wss_max
    if [ $ws_height -ge $wss_max ]
    then
        if [ $wss_pioneer_index -eq 0 ]
        then
            :
        else
	        sed -i -e "s#${endpoints[$wss_pioneer_index]}#${endpoints[0]}#g" $build_endpoint
        fi
        sed -i -e "s#$last_height#var lastHeight = $wss_max#g" telemetry-block.js
    else
        echo $index
        sed -i -e "s#${endpoints[$wss_pioneer_index]}#${endpoints[$index]}#g" $build_endpoint
        sed -i -e "s#$last_height#var lastHeight = $wss_max#g" telemetry-block.js
    fi
fi

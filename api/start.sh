#!/bin/bash



if [ $# = "1" ]
then
    if [ $1 = "-data" ]
    then
	./mongodb/bin/mongod --port 27018 --dbpath ./mongodb/database &
	pid[0]=$!
	echo "MongoDB Started !"
	trap "kill ${pid[0]}; exit 1" INT
	wait
    elif [ $1 = "-api" ]
    then
	nodejs ./NoCoPeApp.js
	pid[0]=$!
	echo "API Started !"
	trap "kill ${pid[0]}; exit 1" INT
	wait
    elif [ $1 = "-h" ]
    then
	echo $0' -data  : launch only the database'
	echo $0' -api   : launch only the api'
	echo $0'        : launch both element, with the database in background'
	echo $0' -h     : display this help'
    fi
else
    ./mongodb/bin/mongod --port 27018 --dbpath ./mongodb/database 2>&1 >> /dev/null &
    pid[0]=$!
    echo "MongoDB Started !"
    sleep 0.5
    nodejs ./NoCoPeApp.js &
    pid[1]=$!
    echo "API Started !"
    trap "kill ${pid[0]} ${pid[1]}; exit 1" INT
    wait
fi

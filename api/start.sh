#!/bin/bash

if [ $# = "1" ]
then
    if [ $1 = "-data" ]
    then
	./mongodb/bin/mongod --port 27018 --dbpath ./mongodb/database
    elif [ $1 = "-api" ]
    then
	nodejs ./NoCoPeApp.js
    elif [ $1 = "-h" ]
    then
	echo $0.' -data  : launch only the database'
	echo $0.' -api   : launch only the api'
	echo $0.'        : launch both element, with the database in background'
	echo $0.' -h     : display this help'
    fi
else
    ./mongodb/bin/mongod --port 27018 --dbpath ./mongodb/database &
    nodejs ./NoCoPeApp.js
fi


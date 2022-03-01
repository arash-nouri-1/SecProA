#!/bin/bash

DIRS="$(find . -type d | tail -n +2 | sed -e "s/\.\///g")"
FAILED=0

for DIR in $DIRS
do
    echo "#############################################"
    echo "Building flow $DIR"
    docker build -f Dockerfile --build-arg checklist=$DIR -t $DIR . > /dev/null
    echo "Running flow $DIR"
    docker run --rm $DIR python /app/oneshot.py $@

    if [ "$?" != "0" ];
    then
        echo ""
        echo "/!\\ $DIR flow failed /!\\"
        FAILED=1
    fi
done

if [ "$FAILED" == "1" ];
then
    echo "#############################################"
    echo ""
    echo "/!\\ Some or all flows have failed! /!\\"

    exit 1
fi

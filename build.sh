#!/bin/bash

docker build -f ./docker/Dockerfile.service --build-arg project=sequencer -t sequencer .

#!/bin/bash
#Created by Usman Mutawakil on
#This script is used in the build server to trigger the creation of the Dynamodb stack

#Ensure the script aborts on any errors
set -e

awsCommand=$1
env=$2
stackName=dynamodb

./deployment/utilities/awsBuild.sh $awsCommand $env $stackName

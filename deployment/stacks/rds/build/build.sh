#!/bin/bash
#Created by Usman Mutawakil on
#This script is used in the build server to trigger the creation of the RDS stack

#Ensure the script aborts on any errors
set -e

awsCommand=$1
env=$2
stackName=rds
username=$3
password=$4

#update the cloudformation properties file with the git commit number and configuration version. These values come from 2 separate github repositories.
./deployment/utilities/awsParameterInjector.sh MasterUsername $username deployment/stacks/$stackName/cloudformation/environments/$env.parameters.json
./deployment/utilities/awsParameterInjector.sh MasterUserPassword $password deployment/stacks/$stackName/cloudformation/environments/$env.parameters.json

./deployment/utilities/awsBuild.sh $awsCommand $env $stackName

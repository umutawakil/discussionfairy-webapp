#!/bin/bash
#Created by Usman Mutawakil on
#This script is used in the build server to trigger the creation of the application stack

#Ensure the script aborts on any errors
set -e

#The env and buckname will change with each jenkins job

#./deployment/application-stack/build/build.sh create prod discussionfairy-prod-deployment application-stack discussionfairy-msc-cdn-prod

awsCommand=$1
env=$2
bucketName=discussionfairy-$2-deployment
stackName=application
cdnBucket=discussionfairy-msc-cdn-$2

#Pack this folder with its dependencies from s3, zip it, then ship it!!!
#aws s3 cp s3://$bucketName/credentials/ ./ --recursive
zip -r $CODEBUILD_SOURCE_VERSION.zip .
aws s3 cp $CODEBUILD_SOURCE_VERSION.zip s3://$bucketName/deployments/$CODEBUILD_SOURCE_VERSION.zip --sse

#move public folder to cdn
aws s3 sync public/ s3://$cdnBucket --acl public-read

#update the cloudformation properties file with the git commit number and configuration version. These values come from 2 separate github repositories.
./deployment/utilities/awsParameterInjector.sh ChangeId $CODEBUILD_SOURCE_VERSION deployment/stacks/$stackName/cloudformation/environments/$env.parameters.json

./deployment/utilities/awsBuild.sh $awsCommand $env $stackName

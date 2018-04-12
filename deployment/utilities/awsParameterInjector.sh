#!/bin/bash
#Usman Mutawakil
#This script updates a given AWS paramters file with a given value in a specific field
#Example: sh /awsParameterInjector.sh APPVERSION 4545455644 stack.dev.properties.json

#Ensure the script aborts on any errors
set -e

parameterKey=$1
parameterValue=$2
fileName=$3

echo $fileName

#Write the properties/parameters file into memory
tempFile=$(<${fileName})
block1="";
block2="";

#Tokenize the file string into segements devided by '}' for each JSON element and store the first block that contains parameterKey
IFS='}';
for word in ${tempFile};
do
	if [[ ${word} == *$parameterKey* ]]
	then
  		block1=${word};
	fi
done

#Remove the '{' to obtain just the key value pair between {  and }. Note: } was already removed in the first loop
IFS='{';
for word in ${block1};
do
	if [[ ${word} == *$parameterKey* ]]
	then
  		block2=${word};
	fi
done

unset IFS; #reset the inputstream seperator back to normal

#Create the new entry with the git commit number
NEW_ENTRY=$(printf "\"ParameterKey\": \"%s\",\"ParameterValue\": \"%s\"" "$parameterKey" "$parameterValue");

#Insert the new entry into the file string.
newFile=${tempFile//${block2}/${NEW_ENTRY}};

#Write the updated file string to the file specified through commandline arguments
echo ${newFile} > ${fileName};
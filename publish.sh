#!/bin/bash

echo "Clear node_modules?"
select yn in "Yes" "No"; do
  case $yn in
    Yes) rm -rf node_modules/; npm i; break;;
    No) echo "Skipped clearing node_modules"; break;;
  esac
done

# TODO support tag selection
version=$(git describe --tags)

read -p "Building mandoc@$version. [Enter] to continue"

npm run build

read -p "Ready to publish mandoc@$version. [Enter] to continue"

cd dist

npm publish

echo "Install the current build as a global package?"
select yn in "Yes" "No"; do
  case $yn in
    Yes) npm install -g; break;;
    No) echo "Skipped npm install -g"; break;;
  esac
done

cd ../

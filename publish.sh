#!/bin/bash

REPO_ROOT=$(cd `dirname $0` && pwd)

case $(uname -s) in
    # Linux*)     machine=Linux;;
    # Darwin*)    machine=Mac;;
    # CYGWIN*)    machine=Cygwin;;
    MINGW*)     REPO_ROOT=$(echo $REPO_ROOT | sed 's/^\///' | sed 's/\//\//g' | sed 's/^./\0:/');;
    # *)          machine="UNKNOWN:${unameOut}"
esac

PKG_MANDOC_ROOT="$REPO_ROOT/packages/mandoc"
PKG_FRONT_MATTER_ROOT="$REPO_ROOT/packages/remarkable-front-matter"
PKG_TPL_PAPER_ROOT="$REPO_ROOT/packages/tpl-paper"

function publishPackage {
  package_path=$1
  package_name=$(node -p "require('$package_path/package.json').name")
  package_version=$(node -p "require('$package_path/package.json').version")
  read -p "Building $package_name@$package_version. [Enter] to continue"
  npx lerna run --stream --scope=$package_name build
  read -p "Ready to publish $package_name@$package_version. [Enter] to continue"
  cd $package_path/$(dirname $(node -p "require('$package_path/package.json').main"))
  npm publish
  cd $REPO_ROOT
}

if [ \
    $(npm view remarkable-front-matter version) \
    = $(node -p "require('$PKG_FRONT_MATTER_ROOT/package.json').version") ]; then
  echo "remarkable-front-matter: up to date"
else
  echo "Publish Package: remarkable-front-matter?"
  select yn in "Yes" "No"; do
    case $yn in
      Yes) publishPackage $PKG_FRONT_MATTER_ROOT; break;;
      No) echo "Skipped publishing `remarkable-front-matter`"; break;;
    esac
  done
fi

cd $REPO_ROOT
if [ \
    $(npm view mandoc-template-paper version) \
    = $(node -p "require('$PKG_TPL_PAPER_ROOT/package.json').version") ]; then
  echo "mandoc-template-paper: up to date"
else
  echo "Publish Package: mandoc-template-paper?"
  select yn in "Yes" "No"; do
    case $yn in
      Yes) publishPackage $PKG_TPL_PAPER_ROOT; break;;
      No) echo "Skipped publishing `mandoc-template-paper`"; break;;
    esac
  done
fi

cd $REPO_ROOT

if [ \
    $(npm view mandoc version) \
    = $(node -p "require('$PKG_MANDOC_ROOT/package.json').version") ]; then
  echo "mandoc: up to date"
else
  echo "Publish Package: ManDoc?"
  select yn in "Yes" "No"; do
    case $yn in
      Yes) publishPackage $PKG_MANDOC_ROOT; break;;
      No) echo "Skipped publishing `ManDoc`"; break;;
    esac
  done
  echo "Install the current build as a global package?"
  select yn in "Yes" "No"; do
    case $yn in
      Yes) cd $PKG_MANDOC_ROOT/dist/package; npm install -g; break;;
      No) echo "Skipped npm install -g"; break;;
    esac
  done
fi

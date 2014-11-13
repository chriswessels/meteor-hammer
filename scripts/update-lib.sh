#!/bin/sh

current_dir=`pwd`
script_rel_dir=`dirname $0`
script_dir=`cd $script_rel_dir && pwd`
root_dir=`dirname $script_dir`

. "$script_dir/settings.sh"

cd $root_dir

echo "Updating hammer.js remote..."

git fetch hammer

read -p "What is the tag/commit/branch for the version of Hammer.js you'd like to bundle? " TAG

git subtree pull --prefix lib hammer $TAG --squash

cd $current_dir

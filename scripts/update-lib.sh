#!/bin/sh

current_dir=`pwd`
script_rel_dir=`dirname $0`
script_dir=`cd $script_rel_dir && pwd`
root_dir=`dirname $script_dir`

. "$script_dir/settings.sh"

cd $root_dir

read -p "What is the tag for the version of Hammer.js you'd like to bundle? " TAG

git subtree pull --prefix lib hammer $APP_GIT_BRANCH --squash

cd $current_dir

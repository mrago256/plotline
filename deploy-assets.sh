#!/bin/bash

DO_HANDLER_BUILD=1
DO_CDK_BUILD=1
DO_CDK_DEPLOY=1

HANDLER_PATH="lambda-handler"
CDK_PATH="cdk"

print_help_info () {
    echo -e 'Usage ' "$0" ' [options]\n'
    echo -e 'Options:\n'
    echo -e 'x\tskip handler build'
    echo -e 'c\tskip cdk build'
    echo -e 'd\tskip cdk deploy'
}

pretty_print_action () {
    echo ">>> $1"
}

build_handler () {
    pretty_print_action "Building Handler"
    npm --prefix "$HANDLER_PATH" run build
    pretty_print_action "Handler Built"
}

build_cdk () {
    pretty_print_action "Building CDK"
    cd "$CDK_PATH"
    npm run build
    npx cdk synth
    cd ..
    pretty_print_action "CDK Built"
}

deploy_cdk () {
    pretty_print_action "Deploying CDK"
    cd "$CDK_PATH"
    npx cdk deploy
    cd ..
    pretty_print_action "CDK Deployed"
}

deploy_assets () {
    set -e

    if [ $DO_HANDLER_BUILD -eq 1 ]
    then
        build_handler
    fi

    if [ $DO_CDK_BUILD -eq 1 ]
    then
        build_cdk
    fi

    if [ $DO_CDK_DEPLOY -eq 1 ]
    then
        deploy_cdk
    fi
}

while getopts "xcdh" option
do
    case $option in
        x) DO_HANDLER_BUILD=0;;
        c) DO_CDK_BUILD=0;;
        d) DO_CDK_DEPLOY=0;;
        h) print_help_info
            exit 0;;
        ?) print_help_info
            exit 1;;
    esac
done

deploy_assets

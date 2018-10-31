#! /bin/bash
git add .
git commit -m "Maven Search"
npm version patch
npm publish
npm unintsall -g alfred-maven
npm install -g alfred-maven

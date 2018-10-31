#! /bin/bash
git add .
git commit -m "Maven Search"
npm version patch
git add .
git commit -m "Maven Search"
npm version patch
npm uninstall -g alfred-maven
npm install -g alfred-maven

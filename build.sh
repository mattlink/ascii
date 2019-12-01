#!/bin/bash
#browserify main.js > main-bundle.js

# NOTE: this script requires you to have a typescript compiler and browserify installed

tsc src/main.ts --outDir built
browserify built/main.js > built/bundle.js

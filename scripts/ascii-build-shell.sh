#!/bin/bash

tsc main.ts 
browserify main.js > bundle.js
open index.html
all:
	tsc; browserify dist/main.js > ./bundle.js
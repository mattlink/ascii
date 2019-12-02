"use strict";
exports.__esModule = true;
var IO = /** @class */ (function () {
    function IO() {
    }
    IO.validControl = function (key) {
        if (key == 'w' ||
            key == 'a' ||
            key == 's' ||
            key == 'd' ||
            key == 'j') // j - wait
            return true;
        return false;
    };
    IO.initKeyBindings = function () {
        document.addEventListener('keypress', function (event) {
            if (event.key == 'w') {
                console.log('w - up');
            }
            else if (event.key == 'a') {
                console.log('a - left');
            }
            else if (event.key == 's') {
                console.log('s - down');
            }
            else if (event.key == 'd') {
                console.log('d - right');
            }
            else {
                console.log('unknown keypress:', event.key);
            }
        });
    };
    IO.genericKeyBinding = function (func) {
        document.addEventListener('keypress', function (event) {
            func(event.key);
        });
    };
    return IO;
}());
exports.IO = IO;

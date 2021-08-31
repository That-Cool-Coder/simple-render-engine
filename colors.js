// A collection of color conversion functions that will probably be added to spnr.js in the future
// note that these probably aren't very efficient,
// because I thought of them myself instead of stealing them

function rgbToDecimal(rgbColor) {
    // rgb color should be an array in form [r, g, b]
    // decimal colors are ones stored as numbers and written in js as 0x123456

    var rString = Math.round(rgbColor[0]).toString(16);
    if (rString.length == 1) rString = '0' + rString;

    var gString = Math.round(rgbColor[1]).toString(16);
    if (gString.length == 1) gString = '0' + gString;

    var bString = Math.round(rgbColor[2]).toString(16);
    if (bString.length == 1) bString = '0' + bString;

    return parseInt('0x' + rString + gString + bString);
}

function decimalToRgb(decimalColor) {
    // decimal colors are ones stored as numbers and written in js as 0x123456
    // rgb color will be an array in form [r, g, b]

    var b = decimalColor % (16 ** 2);
    decimalColor -= b;
    decimalColor >>= 8;
    var g = decimalColor % (16 ** 2);
    decimalColor -= g;
    decimalColor >>= 8;
    var r = decimalColor;
    return [r, g, b];
}
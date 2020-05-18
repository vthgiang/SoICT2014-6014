export const string2literal = (value) => {
    var maps = {
        "NaN": NaN,
        "null": null,
        "undefined": undefined,
        "Infinity": Infinity,
        "-Infinity": -Infinity
    };
    console.log((value in maps) ? maps[value] : value);
    return ((value in maps) ? maps[value] : value);
};

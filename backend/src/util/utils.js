exports.copyIfExists = function(src, dst) {
    for (var key in dst) {
        var val = src[key];

        if (val === null || val === undefined)
            continue;

        dst[key] = val;
    }
}
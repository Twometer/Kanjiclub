/**
 * Copies all keys that exist on both the 'src' and
 * 'dst' object to the 'dst' object.
 * 
 * @param {*} src The object to copy from
 * @param {*} dst The object to copy to
 */
module.exports.copyNonNull = function (src, dst) {
    for (var key in dst) {
        var val = src[key];

        if (val === null || val === undefined)
            continue;

        dst[key] = val;
    }
}

/**
 * Copies all non-null values from src to dst whose
 * keys are specified in the keys array
 * 
 * @param {*} src The object to copy from
 * @param {*} dst The object to copy to
 * @param {*} keys Array of keys
 */
module.exports.copyNonNullByKeys = function (src, dst, keys) {
    for (var key of keys) {
        var val = src[key];

        if (val === null || val === undefined)
            continue;

        dst[key] = val;
    }
}

module.exports.shuffle = function (a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
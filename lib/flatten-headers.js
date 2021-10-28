const flattenHeaders = (headers) => Object.entries(headers || {}).reduce((flat, [key, value]) => {
    flat[key.toLowerCase()] = value;
    return flat;
}, {});

module.exports = flattenHeaders;
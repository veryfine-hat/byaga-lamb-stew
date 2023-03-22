const tryParseJson = require('./try-parse-json');
const Journal = require("@byaga/journal");
const eventBody = (event) => {
  if (event.data) return {data:event.data};

  const contents = tryParseJson(event.body);
  if (contents.error) Journal.exception(contents.error);

  return contents;
};

module.exports = eventBody;
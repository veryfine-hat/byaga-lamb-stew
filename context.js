const { AsyncLocalStorage } = require('async_hooks');
const CONTEXT = 'context';
const CASCADED_CONTEXT = 'cascaded-context'
const LOGGER = 'logger'

const asyncLocalStorage = new AsyncLocalStorage();
const config = new Map()
config.set(CONTEXT, new Map())
config.set(CASCADED_CONTEXT, new Map())
config.set(LOGGER, null)
asyncLocalStorage.enterWith(config)

const configure = options => {
  const store = asyncLocalStorage.getStore();
  options.logger && store.set(LOGGER, options.logger)
}

const getContext = () => asyncLocalStorage.getStore().get(CONTEXT);
const getSharedContext = () => asyncLocalStorage.getStore().get(CASCADED_CONTEXT);
const getLogger = () => asyncLocalStorage.getStore().get(LOGGER);
const annotate = (...args) => getLogger().annotate(...args);
const exception = (...args) => getLogger().exception(...args);
const createSpan = async (fn) => {
  const config = asyncLocalStorage.getStore();
  const childConfig = new Map()
  const logger = getLogger().beginSpan()
  childConfig.set(LOGGER, logger);
  childConfig.set(CONTEXT, new Map())
  childConfig.set(CASCADED_CONTEXT, new Map(config.get(CASCADED_CONTEXT)))
  await asyncLocalStorage.run(childConfig, fn)
  logger.end()
}
const setContext = (name, value, shared = false) => {
  if (shared) { getSharedContext().set(name, value)}
  else { getContext().set(name, value)}
}
const bulkSetContext = (data, shared = false) =>
    Object.entries(data).forEach(([name, value]) => setContext(name, value, shared));

module.exports.createSpan = createSpan
module.exports.withChildSpan = fn => (...args) => createSpan(() => fn(...args))
module.exports.configure = configure
module.exports.log = (...args) => getLogger().log(...args)
module.exports.annotate = annotate
module.exports.startTimer = () => {
  const startAt = Date.now();
  return () => annotate({ 'duration_ms': Date.now() - startAt });
}
module.exports.exception = exception
module.exports.get = (name) => getContext().get(name) || getSharedContext().get(name)
module.exports.set = setContext
module.exports.bulkSet = bulkSetContext
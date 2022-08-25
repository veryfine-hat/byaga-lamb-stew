const { DocumentClient } = require("aws-sdk/clients/dynamodb");

const dynamoDB = new DocumentClient();

const dynamo = async (method, params, { logger })=>{
  logger.annotate({
    'database.table_name': process.env.TABLE_NAME,
    'database.type': 'dynamo',
    'database.method': method
  })
  const done = logger.startTimer('call_database');
  try {
    return { result: await dynamoDB[method](params).promise() };
  } catch(error){
    logger.exception(error);
    return {error}
  } finally {
    done();
  }
}
module.exports = dynamo;
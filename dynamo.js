const { DocumentClient } = require("aws-sdk/clients/dynamodb");
const Context = require('./context')

const dynamoDB = new DocumentClient();

const dynamo = async (method, params) => {
  Context.annotate({
    'database.table_name': process.env.TABLE_NAME,
    'database.type': 'dynamo',
    'database.method': method
  })
  const done = Context.startTimer('call_database');
  try {
    return { result: await dynamoDB[method](params).promise() };
  } catch(error){
    Context.exception(error);
    return {error}
  } finally {
    done();
  }
}
module.exports = dynamo;
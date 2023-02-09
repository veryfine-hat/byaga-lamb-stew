const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const Context = require('./context')

const dynamoDB = new DynamoDB();

const dynamo = async (method, params) => {
  Context.annotate({
    'database.table_name': process.env.TABLE_NAME,
    'database.type': 'dynamo',
    'database.method': method
  })
  const done = Context.startTimer('call_database');
  try {
    return { result: await dynamoDB[method](params) };
  } catch(error){
    Context.exception(error);
    return {error}
  } finally {
    done();
  }
}
module.exports = dynamo;
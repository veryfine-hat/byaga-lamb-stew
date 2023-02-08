const Lambda = require("@aws-sdk/client-lambda");
const Context = require('../context')
const applyTrace = require("./apply-trace")

const lambda = new Lambda({apiVersion: '2015-03-31'})

const invokeLambda = async (functionName, params) => {
  const done = Context.startTimer(functionName)
  try {
    const result = await lambda.invoke({
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(applyTrace(params))
    }).promise()

    if (result.StatusCode !== 200) {
      Context.annotate({
        error: "Lambda Execution Failed",
        'error.detail': result
      })
      return { error: result }
    }

    const payload = JSON.parse(result.Payload)
    if (payload.body && typeof payload.body === 'string' && payload.headers["Content-Type"] === "application/json") {
      payload.body = JSON.parse(payload.body)
    }

    return payload
  } catch(error){
    Context.exception(error)
    return {error}
  }
  finally {
    done()
  }
}

module.exports = invokeLambda
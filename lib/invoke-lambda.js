const Lambda = require("aws-sdk/clients/lambda");
const applyTrace = require("./apply-trace")

const lambda = new Lambda({apiVersion: '2015-03-31'})

const invokeLambda = async (functionName, params, context) => {
  const done = context.logger.startTimer(functionName)
  try {
    const result = await lambda.invoke({
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(applyTrace(context.details, params))
    }).promise()

    if (result.StatusCode !== 200) {
      context.logger.annotate({
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
    context.logger.exception(error)
    return {error}
  }
  finally {
    done()
  }
}

module.exports = invokeLambda
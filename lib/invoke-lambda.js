const { LambdaClient, InvokeCommand} = require("@aws-sdk/client-lambda");
const Journal = require('@byaga/journal')
const applyTrace = require("./apply-trace")

const lambda = new LambdaClient({apiVersion: '2015-03-31'})

const invokeLambda = async (functionName, params) => {
  const done = Journal.startTimer(functionName)
  try {
    const result = await lambda.send(new InvokeCommand({
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(applyTrace(params))
    }))

    if (result.StatusCode >= 300) {
      Journal.annotate({
        error: "Lambda Execution Failed",
        'error.detail': result
      })
      return { error: result }
    }

    const payload = JSON.parse(Buffer.from(result.Payload))
    if (payload.body && typeof payload.body === 'string' && payload.headers["Content-Type"] === "application/json") {
      payload.body = JSON.parse(payload.body)
    }

    if (payload.statusCode) Journal.annotate(`app.${functionName}.status_code`, payload.statusCode )
    if (payload.body?.error) Journal.annotate(`app.${functionName}.error`, payload.body.error )

    return payload
  } catch(error){
    Journal.exception(error)
    return {error}
  }
  finally {
    done()
  }
}

module.exports = invokeLambda
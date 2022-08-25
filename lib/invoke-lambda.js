const { Lambda } = require("aws-sdk");
const applyTrace = require("./apply-trace")

const lambda = new Lambda()

const invokeLambda = async (functionName, params, context) => {
  const done = context.logger.startTimer(functionName)
  try {
    const result = await lambda.invoke({
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      FunctionParams: JSON.stringify(applyTrace(context.details, params))
    })

    if (result.body && result.headers["Content-Type"] === "application/json") {
      result.body = JSON.parse(result.body)
    }

    return result
  } catch(error){
    context.logger.exception(error)
    return {error}
  }
  finally {
    done()
  }
}

module.exports = invokeLambda
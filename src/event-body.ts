import { tryParseJson } from './try-parse-json';
import Journal from "@byaga/journal"
import {MethodResponse} from "./types/MethodResponse";
import {APIGatewayProxyEvent} from "aws-lambda";

export const eventBody = (event: APIGatewayProxyEvent): MethodResponse => {
  const contents = tryParseJson(event.body);
  if (contents.error) Journal.exception(contents.error);

  return contents;
};

export default eventBody;
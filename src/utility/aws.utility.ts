import { DynamoDB, Kinesis } from 'aws-sdk';

// Dynamodb.
export const dynamoDbConverter = DynamoDB.Converter;

// Kinesis.
export const kinesisClient = new Kinesis({});

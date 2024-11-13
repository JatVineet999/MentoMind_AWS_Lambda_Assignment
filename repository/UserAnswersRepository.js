import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class UserAnswersRepository {
  constructor() {
    const dynamoDbClient = new DynamoDBClient({ region: "ap-south-1" });
    this.dynamoDbClient = DynamoDBDocumentClient.from(dynamoDbClient);
    this.tableName = process.env.USER_TEST_INSTANCE_ANSWER_TABLE_NAME;
  }

  async getUserAttemptedQuestions(userId, topicId) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "userTestInstanceId = :userTestInstanceId",
      ExpressionAttributeValues: {
        ":userTestInstanceId": `${userId}#${topicId}`,
      },
      ProjectionExpression: "qId",
    };

    try {
      const data = await this.dynamoDbClient.send(new QueryCommand(params));
      return data.Items.map((item) => item.qId);
    } catch (error) {
      console.error("Error fetching attempted questions:", error);
      throw new Error("Could not fetch attempted questions");
    }
  }
}

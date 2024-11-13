import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class UserAnswersRepository {
  constructor() {
    // Initialize DynamoDB client
    const dynamoDbClient = new DynamoDBClient({ region: "ap-south-1" });

    // Wrap it in DynamoDBDocumentClient
    this.dynamoDbClient = DynamoDBDocumentClient.from(dynamoDbClient);
    this.tableName = process.env.USER_TEST_INSTANCE_ANSWER_TABLE_NAME; // Fetch table name from environment variables
  }

  // Fetch attempted questions by user and topic
  async getUserAttemptedQuestions(userId, topicId) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "userTestInstanceId = :userTestInstanceId",
      ExpressionAttributeValues: {
        ":userTestInstanceId": `${userId}#${topicId}`, // Combine userId and topicId
      },
      ProjectionExpression: "qId",
    };

    try {
      const data = await this.dynamoDbClient.send(new QueryCommand(params)); // Send the QueryCommand
      return data.Items.map((item) => item.qId); // Map to return only qId values
    } catch (error) {
      console.error("Error fetching attempted questions:", error);
      throw new Error("Could not fetch attempted questions");
    }
  }
}

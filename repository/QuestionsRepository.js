import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class QuestionsRepository {
  constructor() {
    // Initialize DynamoDB client
    const dynamoDbClient = new DynamoDBClient();

    // Wrap it in DynamoDBDocumentClient
    this.dynamoDbClient = DynamoDBDocumentClient.from(dynamoDbClient);
  }

  // Fetch questions based on parameters like topic, difficulty, and exclusions
  async fetchQuestions(topicId, difficultyLevel, limit, excludedQuestions) {
    try {
      console.log("Fetching questions with parameters:");
      console.log(
        `TopicId: ${topicId}, Difficulty Level: ${difficultyLevel}, Limit: ${limit}`
      );
      console.log("Excluded Questions:", excludedQuestions);

      // Ensure excludedQuestions is a Set
      const excludedQuestionsSet =
        excludedQuestions && excludedQuestions.length
          ? new Set(excludedQuestions)
          : null;

      // Construct query parameters
      const params = {
        TableName: "q_Questions",
        IndexName: "topicId-index", // Query by topicId
        KeyConditionExpression: "topicId = :topicId",
        ExpressionAttributeValues: {
          ":topicId": topicId, // Add topicId to ExpressionAttributeValues
        },
        FilterExpression: excludedQuestionsSet
          ? "NOT contains(qId, :excludedQuestion)"
          : undefined,
        // Add excludedQuestions only if they are provided
        ...(excludedQuestionsSet && {
          ExpressionAttributeValues: {
            ...params.ExpressionAttributeValues, // Preserve the original values
            ":excludedQuestion": { SS: Array.from(excludedQuestionsSet) },
          },
        }),
        Limit: limit,
      };

      // Send the QueryCommand
      const result = await this.dynamoDbClient.send(new QueryCommand(params));
      return result.Items; // Return fetched questions
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw new Error("Could not fetch questions");
    }
  }
}

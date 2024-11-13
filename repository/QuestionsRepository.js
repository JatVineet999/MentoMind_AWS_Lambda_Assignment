import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class QuestionsRepository {
  constructor() {
  
    const dynamoDbClient = new DynamoDBClient();

    this.dynamoDbClient = DynamoDBDocumentClient.from(dynamoDbClient);
  }

  // Fetch questions based on parameters 
  async fetchQuestions(topicId, difficultyLevel, limit, excludedQuestions) {
    try {
      console.log("Fetching questions with parameters:");
      console.log(
        `TopicId: ${topicId}, Difficulty Level: ${difficultyLevel}, Limit: ${limit}`
      );
      console.log("Excluded Questions:", excludedQuestions);

      // Ensure excludedQuestions 
      const excludedQuestionsSet =
        excludedQuestions && excludedQuestions.length
          ? new Set(excludedQuestions)
          : null;

    
      const params = {
        TableName: "q_Questions",
        IndexName: "topicId-index", 
        KeyConditionExpression: "topicId = :topicId",
        ExpressionAttributeValues: {
          ":topicId": topicId, 
        },
        FilterExpression: excludedQuestionsSet
          ? "NOT contains(qId, :excludedQuestion)"
          : undefined,
        ...(excludedQuestionsSet && {
          ExpressionAttributeValues: {
            ...params.ExpressionAttributeValues, 
            ":excludedQuestion": { SS: Array.from(excludedQuestionsSet) },
          },
        }),
        Limit: limit,
      };

      // Send the QueryCommand
      const result = await this.dynamoDbClient.send(new QueryCommand(params));
      return result.Items; 
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw new Error("Could not fetch questions");
    }
  }
}

import { CommandFactory } from "./factories/CommandFactory.js";

// Lambda handler function
export const handler = async (event, context) => {
  try {
    // Extract data from the event object
    const {
      userId,
      topicId,
      numberOfEasyQuestions,
      numberOfMediumQuestions,
      numberOfHardQuestions,
    } = event;

    // Initialize CommandFactory and create the quiz command
    const commandFactory = new CommandFactory();
    const command = commandFactory.createGenerateQuizCommand(
      userId,
      topicId,
      numberOfEasyQuestions,
      numberOfMediumQuestions,
      numberOfHardQuestions
    );

    // Execute the command to get quiz questions (assuming the command already returns a JSON object)
    const result = await command.execute();

    // Return the result as a proper JSON object (no stringifying)
    return {
      statusCode: 200,
      body: result, // Send the result as is, without stringifying
    };
  } catch (error) {
    // Return error response in JSON format
    return {
      statusCode: 500,
      body: { error: error.message }, // Return the error message as a JSON object
    };
  }
};

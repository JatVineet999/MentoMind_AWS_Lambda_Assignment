import { CommandFactory } from "./factories/CommandFactory.js";

export const handler = async (event, context) => {
  try {
    const {
      userId,
      topicId,
      numberOfEasyQuestions,
      numberOfMediumQuestions,
      numberOfHardQuestions,
    } = event;

    const commandFactory = new CommandFactory();
    const command = commandFactory.createGenerateQuizCommand(
      userId,
      topicId,
      numberOfEasyQuestions,
      numberOfMediumQuestions,
      numberOfHardQuestions
    );

    const result = await command.execute();

    return {
      statusCode: 200,
      body: result,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: error.message },
    };
  }
};

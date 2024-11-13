// Import the GenerateQuizCommand
import { GenerateQuizCommand } from "../commands/GenerateQuizCommand.js";

export class CommandFactory {
  createGenerateQuizCommand(
    userId,
    topicId,
    numberOfEasyQuestions,
    numberOfMediumQuestions,
    numberOfHardQuestions
  ) {
    return new GenerateQuizCommand(
      userId,
      topicId,
      numberOfEasyQuestions,
      numberOfMediumQuestions,
      numberOfHardQuestions
    );
  }
}

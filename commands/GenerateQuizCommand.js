import { QuestionsRepository } from "../repository/QuestionsRepository.js";
import { UserAnswersRepository } from "../repository/UserAnswersRepository.js";

export class GenerateQuizCommand {
  constructor(
    userId,
    topicId,
    numberOfEasyQuestions,
    numberOfMediumQuestions,
    numberOfHardQuestions
  ) {
    this.userId = userId;
    this.topicId = topicId;
    this.numberOfEasyQuestions = numberOfEasyQuestions;
    this.numberOfMediumQuestions = numberOfMediumQuestions;
    this.numberOfHardQuestions = numberOfHardQuestions;
    this.questionsRepository = new QuestionsRepository();
    this.userAnswersRepository = new UserAnswersRepository();
  }

  // Logic to generate the quiz questions
  async execute() {
    // Get the list of previously attempted questions by the user
    const attemptedQuestions =
      await this.userAnswersRepository.getUserAttemptedQuestions(
        this.userId,
        this.topicId
      );

    // Prepare query limits per difficulty level
    const quizQuestions = [];

    // Fetch questions for each difficulty level
    const easyQuestions = await this.questionsRepository.fetchQuestions(
      this.topicId,
      "easy",
      this.numberOfEasyQuestions,
      attemptedQuestions
    );
    quizQuestions.push(...easyQuestions);

    const mediumQuestions = await this.questionsRepository.fetchQuestions(
      this.topicId,
      "medium",
      this.numberOfMediumQuestions,
      attemptedQuestions
    );
    quizQuestions.push(...mediumQuestions);

    const hardQuestions = await this.questionsRepository.fetchQuestions(
      this.topicId,
      "hard",
      this.numberOfHardQuestions,
      attemptedQuestions
    );
    quizQuestions.push(...hardQuestions);

    return quizQuestions;
  }
}

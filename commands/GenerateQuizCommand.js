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

  async execute() {
    const attemptedQuestions =
      await this.userAnswersRepository.getUserAttemptedQuestions(
        this.userId,
        this.topicId
      );

    const quizQuestions = [];

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

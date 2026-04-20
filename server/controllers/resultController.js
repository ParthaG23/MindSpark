import Result from '../models/Result.js';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// @desc    Submit quiz answers and get result
// @route   POST /api/results
// @access  Student only
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    // Fetch the quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    // Grade the submission
    let score = 0;
    const gradedAnswers = answers.map((answer) => {
      const question = quiz.questions.id(answer.questionId);
      if (!question) {
        return {
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect: false,
          pointsEarned: 0,
        };
      }

      const isCorrect =
        question.options[answer.selectedOption]?.isCorrect === true;
      const pointsEarned = isCorrect ? question.points : 0;
      score += pointsEarned;

      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect,
        pointsEarned,
      };
    });

    const result = await Result.create({
      student: req.user._id,
      quiz: quizId,
      score,
      totalPoints: quiz.maxScore,
      timeTaken,
      answers: gradedAnswers,
    });

    // Update quiz stats (using percentage field)
    const allResults = await Result.find({ quiz: quizId });
    const avgScore = allResults.length > 0 
      ? allResults.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0) / allResults.length
      : 0;

    await Quiz.findByIdAndUpdate(quizId, {
      totalAttempts: allResults.length,
      averageScore: Math.round(avgScore),
    });

    // Increment student's attempted count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { quizzesAttempted: 1 },
    });

    // Populate and return
    const populatedResult = await Result.findById(result._id)
      .populate('quiz', 'title subject questions maxScore')
      .populate('student', 'name');

    res.status(201).json({
      success: true,
      result: populatedResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit quiz.',
    });
  }
};

// @desc    Get results for a specific student
// @route   GET /api/results/my-results
// @access  Student only
export const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('quiz', 'title subject difficulty maxScore')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch results.',
    });
  }
};

// @desc    Get a single result by ID
// @route   GET /api/results/:id
// @access  Authenticated
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quiz', 'title subject questions maxScore difficulty')
      .populate('student', 'name email profilePic');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found.',
      });
    }

    // Only allow the student or the quiz creator to view
    const quiz = await Quiz.findById(result.quiz._id || result.quiz);
    const isOwner = result.student._id.toString() === req.user._id.toString();
    const isCreator =
      quiz && quiz.creator.toString() === req.user._id.toString();

    if (!isOwner && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this result.',
      });
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch result.',
    });
  }
};

// @desc    Get leaderboard for a quiz
// @route   GET /api/results/leaderboard/:quizId
// @access  Authenticated
export const getLeaderboard = async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate('student', 'name profilePic')
      .sort({ percentage: -1, timeTaken: 1 }) // Highest score first, fastest time breaks ties
      .limit(20);

    res.status(200).json({
      success: true,
      leaderboard: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard.',
    });
  }
};

// @desc    Get results for a specific quiz (for teacher analytics)
// @route   GET /api/results/quiz/:quizId
// @access  Teacher (quiz owner)
export const getQuizResults = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    if (quiz.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these results.' });
    }

    const results = await Result.find({ quiz: req.params.quizId })
      .populate('student', 'name email profilePic')
      .sort({ createdAt: -1 })
      .lean();

    // Compute maxScore live from questions (in case stored maxScore is stale)
    const liveMaxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 10), 0) || 1;

    // Compute live percentage for each result
    const enrichedResults = results.map((r) => ({
      ...r,
      livePercentage: r.totalPoints > 0
        ? Math.round((r.score / r.totalPoints) * 100)
        : Math.round((r.score / liveMaxScore) * 100),
    }));

    // Calculate per-question stats
    const questionStats = quiz.questions.map((question, qIndex) => {
      let correctCount = 0;
      let totalAnswered = 0;
      const qIdStr = question._id.toString();

      results.forEach((resultDoc) => {
        // Primary: match by questionId
        let answer = (resultDoc.answers || []).find((a) => {
          const aQid = a.questionId ? String(a.questionId) : null;
          return aQid === qIdStr;
        });

        // Fallback: match by index position (answers stored in same order as questions)
        if (!answer && resultDoc.answers && resultDoc.answers[qIndex] !== undefined) {
          answer = resultDoc.answers[qIndex];
        }

        if (answer) {
          totalAnswered++;
          if (answer.isCorrect) correctCount++;
        }
      });

      return {
        questionId: question._id,
        questionText: question.text,
        totalAnswered,
        correctCount,
        accuracy: totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0,
      };
    });

    // Compute summary using LIVE percentages
    const percentages = enrichedResults.map((r) => r.livePercentage);
    const totalAttempts = results.length;
    const avgScore = totalAttempts > 0
      ? Math.round(percentages.reduce((s, p) => s + p, 0) / totalAttempts)
      : 0;
    const highestScore = totalAttempts > 0 ? Math.max(...percentages) : 0;
    const lowestScore  = totalAttempts > 0 ? Math.min(...percentages) : 0;
    const passRate     = totalAttempts > 0
      ? Math.round((percentages.filter((p) => p >= 70).length / totalAttempts) * 100)
      : 0;

    res.status(200).json({
      success: true,
      results,
      questionStats,
      summary: { totalAttempts, averageScore: avgScore, highestScore, lowestScore, passRate },
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quiz results.' });
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/results/student/stats
// @access  Student only
export const getStudentStats = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('quiz', 'title subject difficulty')
      .sort({ createdAt: -1 });

    const totalQuizzes = results.length;
    const averageScore =
      totalQuizzes > 0
        ? Math.round(
            results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes
          )
        : 0;
    const bestScore =
      totalQuizzes > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;

    // Subject performance
    const subjectPerformance = {};
    results.forEach((r) => {
      if (r.quiz) {
        const subj = r.quiz.subject;
        if (!subjectPerformance[subj]) {
          subjectPerformance[subj] = { total: 0, sum: 0 };
        }
        subjectPerformance[subj].total++;
        subjectPerformance[subj].sum += r.percentage;
      }
    });

    const subjectStats = Object.entries(subjectPerformance).map(
      ([subject, data]) => ({
        subject,
        attempts: data.total,
        average: Math.round(data.sum / data.total),
      })
    );

    res.status(200).json({
      success: true,
      stats: {
        totalQuizzes,
        averageScore,
        bestScore,
        subjectStats,
        recentResults: results.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student stats.',
    });
  }
};

import Quiz from '../models/Quiz.js';
import Result from '../models/Result.js';
import User from '../models/User.js';

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Teacher only
export const createQuiz = async (req, res) => {
  try {
    const quizData = {
      ...req.body,
      creator: req.user._id,
    };

    const quiz = await Quiz.create(quizData);

    // Increment teacher's quiz count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { quizzesCreated: 1 },
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create quiz.',
    });
  }
};

// @desc    Get all published quizzes (for students to browse)
// @route   GET /api/quizzes
// @access  Authenticated
export const getQuizzes = async (req, res) => {
  try {
    const { subject, difficulty, search, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };

    if (subject && subject !== 'All') query.subject = subject;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Quiz.countDocuments(query);

    const quizzes = await Quiz.find(query)
      .populate('creator', 'name profilePic')
      .select('-questions.options.isCorrect') // Hide correct answers
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      quizzes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes.',
    });
  }
};

// @desc    Get quizzes created by the logged-in teacher
// @route   GET /api/quizzes/my-quizzes
// @access  Teacher only
export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your quizzes.',
    });
  }
};

// @desc    Get a single quiz by ID (full details for taking)
// @route   GET /api/quizzes/:id
// @access  Authenticated
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      'creator',
      'name profilePic'
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    // If the requester is the creator, return everything
    if (quiz.creator._id.toString() === req.user._id.toString()) {
      return res.status(200).json({ success: true, quiz });
    }

    // For students, hide correct answers
    const quizObj = quiz.toObject();
    quizObj.questions = quizObj.questions.map((q) => ({
      ...q,
      options: q.options.map(({ text, _id }) => ({ text, _id })),
    }));

    res.status(200).json({
      success: true,
      quiz: quizObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz.',
    });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Teacher (owner only)
export const updateQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    if (quiz.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz.',
      });
    }

    // Update fields and save (triggers pre-save hooks for maxScore)
    Object.assign(quiz, req.body);
    await quiz.save();

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update quiz.',
    });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Teacher (owner only)
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    if (quiz.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quiz.',
      });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    // Also delete associated results
    await Result.deleteMany({ quiz: req.params.id });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { quizzesCreated: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete quiz.',
    });
  }
};

// @desc    Toggle quiz publish status
// @route   PATCH /api/quizzes/:id/publish
// @access  Teacher (owner only)
export const togglePublish = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    if (quiz.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized.',
      });
    }

    if (!quiz.isPublished && quiz.questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot publish a quiz with no questions.',
      });
    }

    quiz.isPublished = !quiz.isPublished;
    await quiz.save();

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle publish status.',
    });
  }
};

// @desc    Get teacher dashboard stats
// @route   GET /api/quizzes/dashboard/stats
// @access  Teacher only
export const getTeacherStats = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user._id });
    const quizIds = quizzes.map((q) => q._id);
    const results = await Result.find({ quiz: { $in: quizIds } });

    const totalQuizzes = quizzes.length;
    const publishedQuizzes = quizzes.filter((q) => q.isPublished).length;
    const totalAttempts = results.length;
    const averageScore =
      results.length > 0
        ? Math.round(
            results.reduce((sum, r) => sum + r.percentage, 0) / results.length
          )
        : 0;

    // Subject distribution
    const subjectMap = {};
    quizzes.forEach((q) => {
      subjectMap[q.subject] = (subjectMap[q.subject] || 0) + 1;
    });

    // Recent results
    const recentResults = await Result.find({ quiz: { $in: quizIds } })
      .populate('student', 'name email profilePic')
      .populate('quiz', 'title subject')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalQuizzes,
        publishedQuizzes,
        totalAttempts,
        averageScore,
        subjectDistribution: subjectMap,
        recentResults,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats.',
    });
  }
};

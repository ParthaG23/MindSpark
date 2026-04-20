import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['mcq', 'true-false'],
    default: 'mcq',
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false },
    },
  ],
  points: {
    type: Number,
    default: 10,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: [
        'Mathematics',
        'Science',
        'Technology',
        'History',
        'English',
        'Geography',
        'Computer Science',
        'Physics',
        'Chemistry',
        'Biology',
        'General Knowledge',
        'Other',
      ],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: [questionSchema],
    timeLimit: {
      type: Number, // Total time in minutes for the entire quiz
      default: 30,  // 30 minutes default
      min: 1,
    },
    timerPerQuestion: {
      type: Number, // Time per question in seconds (optional)
      default: 0,   // 0 means use total timer instead
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    totalAttempts: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to calculate max possible score
quizSchema.pre('save', function (next) {
  if (this.questions && this.questions.length > 0) {
    this.maxScore = this.questions.reduce((sum, q) => sum + q.points, 0);
  }
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;

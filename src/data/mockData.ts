export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: "beginner" | "intermediate" | "advanced";
  lessonsCount: number;
  duration: string;
  progress: number;
  tags: string[];
  color: string;
}

export interface Course {
  id: string;
  pathId: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  lessons: Lesson[];
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "text";
  duration: string;
  completed: boolean;
  content: string;
}

export interface PracticeQuestion {
  id: string;
  type: "mcq" | "coding";
  question: string;
  difficulty: "easy" | "medium" | "hard";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  skills: string[];
  steps: string[];
  estimatedTime: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  streak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  coursesCompleted: number;
  badges: Badge[];
  skills: string[];
  plan: "free" | "premium";
  joinedDate: string;
  totalMinutesLearned: number;
  lessonsCompleted: number;
  practicesSolved: number;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  earned: boolean;
  description: string;
}

export const learningPaths: LearningPath[] = [
  {
    id: "python",
    title: "Python Programming",
    description: "Master Python from basics to advanced. Build real applications and automate tasks.",
    icon: "🐍",
    level: "beginner",
    lessonsCount: 48,
    duration: "12 weeks",
    progress: 35,
    tags: ["Programming", "Backend", "Data Science"],
    color: "hsl(210, 100%, 52%)",
  },
  {
    id: "sql",
    title: "SQL & Databases",
    description: "Learn to query, design, and manage databases. Essential for any tech role.",
    icon: "🗄️",
    level: "beginner",
    lessonsCount: 32,
    duration: "8 weeks",
    progress: 60,
    tags: ["Database", "Analytics", "Backend"],
    color: "hsl(38, 92%, 50%)",
  },
  {
    id: "ml",
    title: "Machine Learning",
    description: "Build intelligent systems. From linear regression to deep learning models.",
    icon: "🤖",
    level: "intermediate",
    lessonsCount: 56,
    duration: "16 weeks",
    progress: 10,
    tags: ["AI", "Data Science", "Python"],
    color: "hsl(160, 84%, 39%)",
  },
  {
    id: "web",
    title: "Web Development",
    description: "Build modern websites and web apps with HTML, CSS, JavaScript, and React.",
    icon: "🌐",
    level: "beginner",
    lessonsCount: 64,
    duration: "16 weeks",
    progress: 0,
    tags: ["Frontend", "React", "JavaScript"],
    color: "hsl(280, 50%, 40%)",
  },
  {
    id: "nlp",
    title: "Natural Language Processing",
    description: "Teach machines to understand human language. Build chatbots and text analyzers.",
    icon: "💬",
    level: "advanced",
    lessonsCount: 40,
    duration: "12 weeks",
    progress: 0,
    tags: ["AI", "NLP", "Python"],
    color: "hsl(0, 84%, 60%)",
  },
  {
    id: "data",
    title: "Data Analytics",
    description: "Turn raw data into insights. Master Excel, SQL, Python, and visualization tools.",
    icon: "📊",
    level: "beginner",
    lessonsCount: 36,
    duration: "10 weeks",
    progress: 20,
    tags: ["Analytics", "Visualization", "Python"],
    color: "hsl(200, 80%, 50%)",
  },
];

export const courses: Course[] = [
  {
    id: "py-101",
    pathId: "python",
    title: "Python Fundamentals",
    level: "beginner",
    progress: 70,
    lessons: [
      { id: "l1", title: "Introduction to Python", type: "text", duration: "15 min", completed: true, content: "Python is a versatile, beginner-friendly programming language created by Guido van Rossum in 1991. It's used in web development, data science, AI, automation, and more.\n\n## Why Python?\n- Simple, readable syntax\n- Huge community & library ecosystem\n- Used by Google, Netflix, NASA\n\n## Your First Program\n```python\nprint('Hello, World!')\n```\n\nThis single line outputs text to the console. Python makes it that easy!" },
      { id: "l2", title: "Variables & Data Types", type: "text", duration: "20 min", completed: true, content: "Variables store data. In Python, you don't need to declare types.\n\n```python\nname = 'Alice'      # string\nage = 25             # integer\nheight = 5.6         # float\nis_student = True    # boolean\n```\n\n## Common Data Types\n- **str**: Text (`'hello'`)\n- **int**: Whole numbers (`42`)\n- **float**: Decimals (`3.14`)\n- **bool**: True/False\n- **list**: Ordered collection (`[1, 2, 3]`)\n- **dict**: Key-value pairs (`{'name': 'Alice'}`)" },
      { id: "l3", title: "Control Flow", type: "text", duration: "25 min", completed: true, content: "Control flow lets your program make decisions.\n\n## If Statements\n```python\nage = 18\nif age >= 18:\n    print('You can vote!')\nelse:\n    print('Too young to vote')\n```\n\n## Loops\n```python\n# For loop\nfor i in range(5):\n    print(i)\n\n# While loop\ncount = 0\nwhile count < 5:\n    count += 1\n```" },
      { id: "l4", title: "Functions", type: "text", duration: "20 min", completed: false, content: "Functions are reusable blocks of code.\n\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('Alice'))\n```\n\n## Key Concepts\n- `def` keyword defines a function\n- Parameters are inputs\n- `return` sends back a value\n- Functions make code DRY (Don't Repeat Yourself)" },
      { id: "l5", title: "Lists & Dictionaries", type: "text", duration: "25 min", completed: false, content: "Lists and dictionaries are essential data structures.\n\n## Lists\n```python\nfruits = ['apple', 'banana', 'cherry']\nfruits.append('date')\nprint(fruits[0])  # apple\n```\n\n## Dictionaries\n```python\nstudent = {\n    'name': 'Alice',\n    'age': 20,\n    'grade': 'A'\n}\nprint(student['name'])\n```" },
    ],
  },
  {
    id: "py-201",
    pathId: "python",
    title: "Python Intermediate",
    level: "intermediate",
    progress: 0,
    lessons: [
      { id: "l6", title: "Object-Oriented Programming", type: "text", duration: "30 min", completed: false, content: "OOP organizes code into classes and objects.\n\n```python\nclass Dog:\n    def __init__(self, name, breed):\n        self.name = name\n        self.breed = breed\n    \n    def bark(self):\n        return f'{self.name} says Woof!'\n\nmy_dog = Dog('Rex', 'Labrador')\nprint(my_dog.bark())\n```" },
      { id: "l7", title: "File Handling", type: "text", duration: "20 min", completed: false, content: "Read and write files in Python.\n\n```python\n# Writing\nwith open('data.txt', 'w') as f:\n    f.write('Hello, file!')\n\n# Reading\nwith open('data.txt', 'r') as f:\n    content = f.read()\n    print(content)\n```" },
    ],
  },
];

export const practiceQuestions: PracticeQuestion[] = [
  { id: "q1", type: "mcq", question: "What is the output of print(type(42))?", difficulty: "easy", options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'number'>"], correctAnswer: "<class 'int'>", explanation: "42 is an integer, so type() returns <class 'int'>.", topic: "Python" },
  { id: "q2", type: "mcq", question: "Which keyword is used to define a function in Python?", difficulty: "easy", options: ["function", "def", "fn", "define"], correctAnswer: "def", explanation: "In Python, 'def' is the keyword used to define a function.", topic: "Python" },
  { id: "q3", type: "mcq", question: "What does SQL stand for?", difficulty: "easy", options: ["Structured Query Language", "Simple Query Logic", "Standard Query Language", "Sequential Query Language"], correctAnswer: "Structured Query Language", explanation: "SQL stands for Structured Query Language, used to manage relational databases.", topic: "SQL" },
  { id: "q4", type: "mcq", question: "Which of the following is a mutable data type in Python?", difficulty: "medium", options: ["tuple", "string", "list", "int"], correctAnswer: "list", explanation: "Lists are mutable — you can change their elements after creation.", topic: "Python" },
  { id: "q5", type: "coding", question: "Write a function `is_palindrome(s)` that returns True if a string is a palindrome.", difficulty: "medium", correctAnswer: "def is_palindrome(s):\n    return s == s[::-1]", explanation: "A palindrome reads the same forwards and backwards. Slicing with [::-1] reverses the string.", topic: "Python" },
  { id: "q6", type: "mcq", question: "What is the time complexity of binary search?", difficulty: "medium", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: "O(log n)", explanation: "Binary search divides the search space in half each step, giving O(log n).", topic: "Algorithms" },
  { id: "q7", type: "coding", question: "Write a SQL query to select all users older than 25 from a 'users' table.", difficulty: "easy", correctAnswer: "SELECT * FROM users WHERE age > 25;", explanation: "Use SELECT with WHERE clause to filter rows based on conditions.", topic: "SQL" },
  { id: "q8", type: "mcq", question: "In machine learning, what is overfitting?", difficulty: "hard", options: ["Model performs well on training but poorly on new data", "Model performs poorly on all data", "Model is too simple", "Model has too few features"], correctAnswer: "Model performs well on training but poorly on new data", explanation: "Overfitting occurs when a model memorizes training data instead of learning general patterns.", topic: "Machine Learning" },
];

export const projects: Project[] = [
  { id: "p1", title: "Personal Budget Tracker", description: "Build a Python CLI app that tracks income and expenses, with monthly reports.", level: "beginner", skills: ["Python", "File I/O", "Data Structures"], steps: ["Set up project structure", "Create expense data model", "Build CLI input system", "Add file storage", "Generate monthly summary", "Add category filtering"], estimatedTime: "4-6 hours" },
  { id: "p2", title: "Weather Dashboard", description: "Create a web dashboard that shows real-time weather data using a public API.", level: "intermediate", skills: ["Python", "APIs", "Data Visualization"], steps: ["Set up API connection", "Parse weather JSON data", "Create data processing functions", "Build visualization charts", "Add location search", "Deploy dashboard"], estimatedTime: "8-10 hours" },
  { id: "p3", title: "Sentiment Analyzer", description: "Build an NLP model that analyzes the sentiment of movie reviews.", level: "advanced", skills: ["Python", "NLP", "Machine Learning"], steps: ["Collect review dataset", "Preprocess text data", "Build feature extraction", "Train classification model", "Evaluate model performance", "Build prediction API"], estimatedTime: "15-20 hours" },
  { id: "p4", title: "Todo App with Database", description: "Build a full-stack todo application with SQL database backend.", level: "beginner", skills: ["SQL", "Python", "CRUD Operations"], steps: ["Design database schema", "Set up SQLite database", "Create CRUD functions", "Build CLI interface", "Add search and filter", "Add due dates and priorities"], estimatedTime: "5-7 hours" },
  { id: "p5", title: "E-commerce Data Pipeline", description: "Design and build a data pipeline to process e-commerce transactions.", level: "advanced", skills: ["Python", "SQL", "ETL", "Data Engineering"], steps: ["Design data schema", "Build data generators", "Create ETL pipeline", "Implement data validation", "Build analytics queries", "Create automated reports"], estimatedTime: "20-25 hours" },
];

export const userProfile: UserProfile = {
  name: "Alex Chen",
  email: "alex.chen@email.com",
  avatar: "AC",
  streak: 12,
  longestStreak: 21,
  totalXP: 2450,
  level: 8,
  coursesCompleted: 3,
  plan: "free",
  joinedDate: "2025-11-15",
  totalMinutesLearned: 1840,
  lessonsCompleted: 27,
  practicesSolved: 42,
  badges: [
    { id: "b1", title: "First Steps", icon: "🎯", earned: true, description: "Complete your first lesson" },
    { id: "b2", title: "Week Warrior", icon: "🔥", earned: true, description: "7-day learning streak" },
    { id: "b3", title: "Problem Solver", icon: "💡", earned: true, description: "Solve 10 practice problems" },
    { id: "b4", title: "Project Builder", icon: "🏗️", earned: false, description: "Complete your first project" },
    { id: "b5", title: "Python Master", icon: "🐍", earned: false, description: "Complete the Python learning path" },
    { id: "b6", title: "Data Wizard", icon: "📊", earned: false, description: "Complete the Data Analytics path" },
    { id: "b7", title: "Speed Learner", icon: "⚡", earned: true, description: "Complete 5 lessons in one day" },
    { id: "b8", title: "Community Helper", icon: "🤝", earned: false, description: "Answer 10 community questions" },
    { id: "b9", title: "Streak Master", icon: "🏆", earned: false, description: "Achieve a 30-day streak" },
  ],
  skills: ["Python Basics", "Variables & Types", "Control Flow", "SQL Basics", "Data Visualization"],
};

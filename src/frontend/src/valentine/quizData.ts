export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
}

export const quizQuestions: QuizQuestion[] = [
  {
    q: "What was the first flirt we did together?",
    options: [
      "Amr bed onk boro you can beside me if ur scared",
      "Ur so gorgeous baby",
      "Kache asho let me kiss u",
      "I love you on my birthday"
    ],
    answer: 0
  },
  {
    q: "What was I wearing on our first meetup?",
    options: ["White", "Black", "Yellow", "Grey"],
    answer: 1
  },
  {
    q: "What was the first movie we saw together on VC?",
    options: ["Drishyan", "Culpa Mia", "Culpa Tua", "Jab We Met"],
    answer: 3
  },
  {
    q: "What game do we play most on VC?",
    options: ["Snake", "How well do you know me", "Song trivia", "Ludo"],
    answer: 1
  },
  {
    q: "What is my favourite food?",
    options: ["Biscoff cheesecake", "Cheese burger", "Pizza", "Baklava"],
    answer: 0
  },
  {
    q: "If I win a lottery what will I buy?",
    options: ["Cars", "Shoes", "On you", "Perfume"],
    answer: 3
  },
  {
    q: "Since when do we love each other?",
    options: ["Dec 6 2023", "Dec 30 2023", "Jan 5 2024", "First week of Feb 2024"],
    answer: 3
  },
  {
    q: "If I disappear 3-4 hours where am I?",
    options: ["Club", "Family party", "Football field", "Mall"],
    answer: 2
  },
  {
    q: "Will you always be my baby?",
    options: ["2 months", "6 months", "1 year", "Yes forever"],
    answer: 3
  },
  {
    q: "Will you be my Valentine?",
    options: ["Yes", "No"],
    answer: 0
  }
];

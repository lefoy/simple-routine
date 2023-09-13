const getDefaultTasks = (getRoutineItemStructure) => [
  {
    ...getRoutineItemStructure(), name: "Make my bed", emoji: "bed", avgTime: 2,
  },
  {
    ...getRoutineItemStructure(), name: "Brush my teeth", emoji: "tooth", avgTime: 3,
  },
  {
    ...getRoutineItemStructure(), name: "Take a shower", emoji: "shower", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Eat breakfast", emoji: "utensils", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Exercise", emoji: "dumbbell", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Meditate", emoji: "peace", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Read the news", emoji: "newspaper", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Walk the dog", emoji: "dog", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Feed the pets", emoji: "fish", avgTime: 5,
  },
  {
    ...getRoutineItemStructure(), name: "Water the plants", emoji: "leaf", avgTime: 7,
  },
  {
    ...getRoutineItemStructure(), name: "Check emails", emoji: "envelope", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Plan the day", emoji: "calendar", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Work on project", emoji: "laptop", avgTime: 60,
  },
  {
    ...getRoutineItemStructure(), name: "Prepare lunch", emoji: "hamburger", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Take a break", emoji: "coffee", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Run errands", emoji: "car", avgTime: 45,
  },
  {
    ...getRoutineItemStructure(), name: "Laundry", emoji: "tshirt", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Study", emoji: "book", avgTime: 45,
  },
  {
    ...getRoutineItemStructure(), name: "Tidy up", emoji: "broom", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Call family", emoji: "phone", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Cook dinner", emoji: "drumstick-bite", avgTime: 45,
  },
  {
    ...getRoutineItemStructure(), name: "Do the dishes", emoji: "sink", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Floss", emoji: "tooth", avgTime: 3,
  },
  {
    ...getRoutineItemStructure(), name: "Watch a movie", emoji: "film", avgTime: 120,
  },
  {
    ...getRoutineItemStructure(), name: "Read a book", emoji: "book-reader", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Journal", emoji: "pen", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Play an instrument", emoji: "guitar", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Night skincare", emoji: "spa", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Go for a walk", emoji: "walking", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Recycle", emoji: "recycle", avgTime: 5,
  },
  {
    ...getRoutineItemStructure(), name: "Grocery shopping", emoji: "shopping-cart", avgTime: 45,
  },
  {
    ...getRoutineItemStructure(), name: "Social media time", emoji: "mobile", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Listen to a podcast", emoji: "headphones", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Online course", emoji: "graduation-cap", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Play video games", emoji: "gamepad", avgTime: 60,
  },
  {
    ...getRoutineItemStructure(), name: "Attend a meeting", emoji: "users", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Paint or draw", emoji: "paint-brush", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Review goals", emoji: "bullseye", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Photography", emoji: "camera", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Take vitamins", emoji: "capsules", avgTime: 2,
  },
  {
    ...getRoutineItemStructure(), name: "Charge electronics", emoji: "battery-full", avgTime: 5,
  },
  {
    ...getRoutineItemStructure(), name: "Pray or spiritual time", emoji: "pray", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Bake", emoji: "cookie", avgTime: 40,
  },
  {
    ...getRoutineItemStructure(), name: "Manage finances", emoji: "wallet", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Back up computer files", emoji: "database", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Write a letter or email", emoji: "paper-plane", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Clean the bathroom", emoji: "soap", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Vacuum the house", emoji: "home", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Gardening", emoji: "seedling", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Clean the fridge", emoji: "snowflake", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Meal prep", emoji: "carrot", avgTime: 40,
  },
  {
    ...getRoutineItemStructure(), name: "Go for a run", emoji: "running", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Swimming", emoji: "swimmer", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Write a blog post", emoji: "keyboard", avgTime: 45,
  },
  {
    ...getRoutineItemStructure(), name: "Play a board game", emoji: "dice", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Hair care", emoji: "cut", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Take a power nap", emoji: "bed", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Pay bills", emoji: "money-bill-wave", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Make a to-do list", emoji: "list", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Go cycling", emoji: "biking", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Crafting", emoji: "palette", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Do some stretches", emoji: "child", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Learn a new recipe", emoji: "utensils", avgTime: 40,
  },
  {
    ...getRoutineItemStructure(), name: "Take out the trash", emoji: "trash", avgTime: 5,
  },
  {
    ...getRoutineItemStructure(), name: "Clean your phone", emoji: "mobile-alt", avgTime: 5,
  },
  {
    ...getRoutineItemStructure(), name: "Change bed sheets", emoji: "bed", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Plan your budget", emoji: "piggy-bank", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Clean your desk", emoji: "chair", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Clean your car", emoji: "car-side", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Declutter", emoji: "box", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Watch a tutorial", emoji: "youtube", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Yoga", emoji: "om", avgTime: 20,
  },
  {
    ...getRoutineItemStructure(), name: "Dance", emoji: "music", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Clean shoes", emoji: "shoe-prints", avgTime: 10,
  },
  {
    ...getRoutineItemStructure(), name: "Write poetry", emoji: "feather", avgTime: 15,
  },
  {
    ...getRoutineItemStructure(), name: "Visit a library", emoji: "book", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Go to a gym", emoji: "dumbbell", avgTime: 60,
  },
  {
    ...getRoutineItemStructure(), name: "Play chess", emoji: "chess", avgTime: 30,
  },
  {
    ...getRoutineItemStructure(), name: "Try a new restaurant", emoji: "utensils", avgTime: 60,
  },
];

export default getDefaultTasks;

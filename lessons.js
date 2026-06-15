const LESSONS = [
  {
    id: "greetings",
    unit: "Unit 1 - Safari Start",
    title: "Greetings",
    icon: "👋",
    category: "vocabulary",
    guide: `<h4>Greetings - Salamu</h4><p>Learn how to say hello and goodbye in English!</p><h4>Key Words</h4><ul><li><b>Hello</b> = Habari</li><li><b>Good morning</b> = Habari za asubuhi</li><li><b>Good afternoon</b> = Habari za mchana</li><li><b>Goodbye</b> = Kwaheri</li><li><b>Thank you</b> = Asante</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Hello' mean in Swahili?", options: ["Kwaheri", "Habari", "Asante", "Pole"], correct: 1 },
      { type: "fillblank", sentence: "Good ___ is the greeting you use in the morning.", answer: "morning", options: ["morning", "night", "afternoon", "evening"] },
      { type: "match", pairs: [["Hello", "Habari"], ["Goodbye", "Kwaheri"], ["Thank you", "Asante"]] },
      { type: "multiple", question: "When do you say 'Good afternoon'?", options: ["Before noon", "At night", "From noon to evening", "Early morning"], correct: 2 },
      { type: "tap", phrase: "Good morning", words: ["Good", "night", "morning", "evening", "bye"] },
      { type: "multiple", question: "Which is NOT a greeting?", options: ["Hello", "Good morning", "Goodbye", "Thank you"], correct: 3 },
    ],
    words: [{ en: "Hello", sw: "Habari" }, { en: "Good morning", sw: "Habari za asubuhi" }, { en: "Goodbye", sw: "Kwaheri" }, { en: "Thank you", sw: "Asante" }]
  },
  {
    id: "numbers",
    unit: "Unit 1 - Safari Start",
    title: "Numbers 1-10",
    icon: "🔢",
    category: "vocabulary",
    guide: `<h4>Numbers - Nambari</h4><p>Count from 1 to 10!</p><h4>The Numbers</h4><ul><li><b>1 One</b> = Moja</li><li><b>2 Two</b> = Mbili</li><li><b>3 Three</b> = Tatu</li><li><b>4 Four</b> = Nne</li><li><b>5 Five</b> = Tano</li><li><b>6 Six</b> = Sita</li><li><b>7 Seven</b> = Saba</li><li><b>8 Eight</b> = Nane</li><li><b>9 Nine</b> = Tisa</li><li><b>10 Ten</b> = Kumi</li></ul>`,
    exercises: [
      { type: "multiple", question: "What is '3' in English?", options: ["Two", "Three", "Four", "Five"], correct: 1 },
      { type: "fillblank", sentence: "The number 5 in English is ___.", answer: "five", options: ["five", "four", "six", "three"] },
      { type: "match", pairs: [["One", "Moja"], ["Two", "Mbili"], ["Three", "Tatu"], ["Five", "Tano"]] },
      { type: "multiple", question: "What does 'Seven' mean in Swahili?", options: ["Sita", "Saba", "Nane", "Tisa"], correct: 1 },
      { type: "tap", phrase: "three five one", words: ["three", "two", "five", "one", "four"] },
      { type: "multiple", question: "How do you say 'Mbili' in English?", options: ["One", "Two", "Three", "Four"], correct: 1 },
    ],
    words: [{ en: "One", sw: "Moja" }, { en: "Two", sw: "Mbili" }, { en: "Three", sw: "Tatu" }, { en: "Five", sw: "Tano" }, { en: "Ten", sw: "Kumi" }]
  },
  {
    id: "family",
    unit: "Unit 2 - Family & Friends",
    title: "Family",
    icon: "👨‍👩‍👧‍👦",
    category: "vocabulary",
    guide: `<h4>Family - Familia</h4><p>Learn words for family members!</p><h4>Key Words</h4><ul><li><b>Mother</b> = Mama</li><li><b>Father</b> = Baba</li><li><b>Sister</b> = Dada</li><li><b>Brother</b> = Kaka</li><li><b>Grandmother</b> = Bibi</li><li><b>Grandfather</b> = Babu</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Mother' mean in Swahili?", options: ["Baba", "Mama", "Dada", "Kaka"], correct: 1 },
      { type: "fillblank", sentence: "Your ___ is your female parent.", answer: "mother", options: ["mother", "father", "sister", "brother"] },
      { type: "match", pairs: [["Mother", "Mama"], ["Father", "Baba"], ["Sister", "Dada"], ["Brother", "Kaka"]] },
      { type: "multiple", question: "What is 'Grandmother' in Swahili?", options: ["Babu", "Mama", "Bibi", "Dada"], correct: 2 },
      { type: "tap", phrase: "my mother and father", words: ["my", "mother", "sister", "and", "father", "brother"] },
      { type: "multiple", question: "Which word means 'Baba'?", options: ["Mother", "Sister", "Father", "Brother"], correct: 2 },
    ],
    words: [{ en: "Mother", sw: "Mama" }, { en: "Father", sw: "Baba" }, { en: "Sister", sw: "Dada" }, { en: "Brother", sw: "Kaka" }]
  },
  {
    id: "colors",
    unit: "Unit 2 - Family & Friends",
    title: "Colors",
    icon: "🎨",
    category: "vocabulary",
    guide: `<h4>Colors - Rangi</h4><p>Learn colors!</p><h4>Key Words</h4><ul><li><b>Red</b> = Nyekundu</li><li><b>Blue</b> = Bluu</li><li><b>Green</b> = Kijani</li><li><b>Yellow</b> = Njano</li><li><b>Orange</b> = Machungwa</li><li><b>Black</b> = Nyeusi</li><li><b>White</b> = Nyeupe</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Green' mean in Swahili?", options: ["Nyekundu", "Kijani", "Njano", "Bluu"], correct: 1 },
      { type: "fillblank", sentence: "The sky is usually ___.", answer: "blue", options: ["blue", "red", "green", "yellow"] },
      { type: "match", pairs: [["Red", "Nyekundu"], ["Blue", "Bluu"], ["Green", "Kijani"], ["Yellow", "Njano"]] },
      { type: "multiple", question: "What is 'Nyekundu' in English?", options: ["Blue", "Green", "Yellow", "Red"], correct: 3 },
      { type: "tap", phrase: "red and yellow", words: ["red", "blue", "and", "yellow", "green"] },
      { type: "listen", question: "What color do you hear?", audio: "blue", display: ["Red", "Blue", "Green", "Yellow"], correct: 1 },
    ],
    words: [{ en: "Red", sw: "Nyekundu" }, { en: "Blue", sw: "Bluu" }, { en: "Green", sw: "Kijani" }, { en: "Yellow", sw: "Njano" }]
  },
  {
    id: "food",
    unit: "Unit 3 - Safari Life",
    title: "Food & Drinks",
    icon: "🍽️",
    category: "vocabulary",
    guide: `<h4>Food & Drinks - Chakula na Vinywaji</h4><p>Learn food and drink words!</p><h4>Key Words</h4><ul><li><b>Water</b> = Maji</li><li><b>Rice</b> = Wali</li><li><b>Bread</b> = Mkate</li><li><b>Milk</b> = Maziwa</li><li><b>Fruit</b> = Tunda</li><li><b>Meat</b> = Nyama</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Water' mean in Swahili?", options: ["Maji", "Milk", "Juice", "Tea"], correct: 0 },
      { type: "fillblank", sentence: "You drink ___ when you are thirsty.", answer: "water", options: ["water", "rice", "bread", "meat"] },
      { type: "match", pairs: [["Water", "Maji"], ["Bread", "Mkate"], ["Milk", "Maziwa"], ["Rice", "Wali"]] },
      { type: "multiple", question: "What is 'Mkate' in English?", options: ["Rice", "Water", "Bread", "Milk"], correct: 2 },
      { type: "tap", phrase: "I eat bread", words: ["I", "eat", "bread", "drink", "rice"] },
      { type: "listen", question: "What do you hear?", audio: "water", display: ["Maji", "Wali", "Mkate", "Maziwa"], correct: 0 },
    ],
    words: [{ en: "Water", sw: "Maji" }, { en: "Rice", sw: "Wali" }, { en: "Bread", sw: "Mkate" }, { en: "Milk", sw: "Maziwa" }]
  },
  {
    id: "animals",
    unit: "Unit 3 - Safari Life",
    title: "Animals",
    icon: "🦁",
    category: "vocabulary",
    guide: `<h4>Animals - Wanyama</h4><p>Learn African animal names!</p><h4>Key Words</h4><ul><li><b>Lion</b> = Simba</li><li><b>Elephant</b> = Tembo</li><li><b>Giraffe</b> = Twiga</li><li><b>Zebra</b> = Punda milia</li><li><b>Hippo</b> = Kiboko</li><li><b>Monkey</b> = Tumbili</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Simba' mean in English?", options: ["Elephant", "Lion", "Giraffe", "Zebra"], correct: 1 },
      { type: "fillblank", sentence: "A ___ is a tall animal with a long neck.", answer: "giraffe", options: ["giraffe", "lion", "zebra", "monkey"] },
      { type: "match", pairs: [["Lion", "Simba"], ["Elephant", "Tembo"], ["Giraffe", "Twiga"], ["Zebra", "Punda milia"]] },
      { type: "multiple", question: "What is 'Twiga' in English?", options: ["Zebra", "Giraffe", "Lion", "Hippo"], correct: 1 },
      { type: "tap", phrase: "the lion is big", words: ["the", "lion", "monkey", "is", "big", "small"] },
      { type: "listen", question: "What animal do you hear?", audio: "elephant", display: ["Simba", "Tembo", "Twiga", "Kiboko"], correct: 1 },
    ],
    words: [{ en: "Lion", sw: "Simba" }, { en: "Elephant", sw: "Tembo" }, { en: "Giraffe", sw: "Twiga" }, { en: "Zebra", sw: "Punda milia" }]
  },
  {
    id: "body",
    unit: "Unit 4 - About Me",
    title: "Body Parts",
    icon: "🦵",
    category: "vocabulary",
    guide: `<h4>Body Parts - Sehemu za Mwili</h4><p>Learn parts of your body!</p><h4>Key Words</h4><ul><li><b>Head</b> = Kichwa</li><li><b>Eye</b> = Jicho</li><li><b>Ear</b> = Sikio</li><li><b>Nose</b> = Pua</li><li><b>Mouth</b> = Mdomo</li><li><b>Hand</b> = Mkono</li><li><b>Foot</b> = Mguu</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Kichwa' mean in English?", options: ["Hand", "Head", "Foot", "Eye"], correct: 1 },
      { type: "fillblank", sentence: "You have two ___ to see things.", answer: "eyes", options: ["eyes", "ears", "hands", "feet"] },
      { type: "match", pairs: [["Head", "Kichwa"], ["Hand", "Mkono"], ["Eye", "Jicho"], ["Foot", "Mguu"]] },
      { type: "multiple", question: "What is 'Mkono' in English?", options: ["Foot", "Hand", "Head", "Mouth"], correct: 1 },
      { type: "tap", phrase: "my hands and feet", words: ["my", "hands", "and", "feet", "head", "eyes"] },
      { type: "listen", question: "What body part do you hear?", audio: "head", display: ["Mkono", "Kichwa", "Mguu", "Jicho"], correct: 1 },
    ],
    words: [{ en: "Head", sw: "Kichwa" }, { en: "Eye", sw: "Jicho" }, { en: "Hand", sw: "Mkono" }, { en: "Foot", sw: "Mguu" }]
  },
  {
    id: "phrases",
    unit: "Unit 4 - About Me",
    title: "Common Phrases",
    icon: "💬",
    category: "sentences",
    guide: `<h4>Common Phrases - Istilahi za Kawaida</h4><p>Useful phrases!</p><h4>Key Phrases</h4><ul><li><b>Thank you</b> = Asante</li><li><b>Please</b> = Tafadhali</li><li><b>Sorry</b> = Pole</li><li><b>Yes</b> = Ndiyo</li><li><b>No</b> = Hapana</li><li><b>Excuse me</b> = Samahani</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Thank you' mean in Swahili?", options: ["Pole", "Asante", "Tafadhali", "Samahani"], correct: 1 },
      { type: "fillblank", sentence: "You say ___ when you bump into someone.", answer: "sorry", options: ["sorry", "please", "thank you", "yes"] },
      { type: "match", pairs: [["Yes", "Ndiyo"], ["No", "Hapana"], ["Sorry", "Pole"], ["Please", "Tafadhali"]] },
      { type: "multiple", question: "Which means 'Pole'?", options: ["Thank you", "Please", "Sorry", "Yes"], correct: 2 },
      { type: "tap", phrase: "thank you very much", words: ["thank", "you", "sorry", "very", "much", "please"] },
      { type: "listen", question: "What phrase do you hear?", audio: "thank you", display: ["Pole", "Asante", "Hapana", "Tafadhali"], correct: 1 },
    ],
    words: [{ en: "Thank you", sw: "Asante" }, { en: "Please", sw: "Tafadhali" }, { en: "Sorry", sw: "Pole" }, { en: "Yes", sw: "Ndiyo" }]
  },
  // ── Unit 5 - NEW: Animals Advanced ──
  {
    id: "wild",
    unit: "Unit 5 - Wild Safari",
    title: "Wild Animals",
    icon: "🐘",
    category: "vocabulary",
    guide: `<h4>Wild Animals - Wanyama wa Porini</h4><p>More African animals!</p><h4>Key Words</h4><ul><li><b>Rhino</b> = Kifaru</li><li><b>Buffalo</b> = Nyati</li><li><b>Cheetah</b> = Duma</li><li><b>Crocodile</b> = Mamba</li><li><b>Hyena</b> = Fisi</li><li><b>Warthog</b> = Ngiri</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Kifaru' mean in English?", options: ["Buffalo", "Rhino", "Cheetah", "Hyena"], correct: 1 },
      { type: "fillblank", sentence: "The fastest land animal is the ___.", answer: "cheetah", options: ["cheetah", "lion", "zebra", "hyena"] },
      { type: "match", pairs: [["Rhino", "Kifaru"], ["Cheetah", "Duma"], ["Crocodile", "Mamba"], ["Hyena", "Fisi"]] },
      { type: "multiple", question: "What is 'Mamba' in English?", options: ["Hyena", "Buffalo", "Crocodile", "Warthog"], correct: 2 },
      { type: "tap", phrase: "cheetah runs fast", words: ["cheetah", "lion", "runs", "fast", "slow"] },
      { type: "listen", question: "Which animal do you hear?", audio: "cheetah", display: ["Simba", "Duma", "Twiga", "Fisi"], correct: 1 },
    ],
    words: [{ en: "Rhino", sw: "Kifaru" }, { en: "Cheetah", sw: "Duma" }, { en: "Crocodile", sw: "Mamba" }, { en: "Hyena", sw: "Fisi" }]
  },
  // ── Unit 5 - NEW: Nature ──
  {
    id: "nature",
    unit: "Unit 5 - Wild Safari",
    title: "Nature & Landscape",
    icon: "🌿",
    category: "vocabulary",
    guide: `<h4>Nature - Mazingira</h4><p>Learn nature words!</p><h4>Key Words</h4><ul><li><b>Tree</b> = Mti</li><li><b>River</b> = Mto</li><li><b>Mountain</b> = Mlima</li><li><b>Sun</b> = Jua</li><li><b>Moon</b> = Mwezi</li><li><b>Star</b> = Nyota</li><li><b>Rain</b> = Mvua</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Mti' mean in English?", options: ["River", "Tree", "Mountain", "Sun"], correct: 1 },
      { type: "fillblank", sentence: "The ___ shines brightly during the day.", answer: "sun", options: ["sun", "moon", "star", "rain"] },
      { type: "match", pairs: [["Sun", "Jua"], ["Moon", "Mwezi"], ["River", "Mto"], ["Mountain", "Mlima"]] },
      { type: "multiple", question: "What is 'Mvua' in English?", options: ["Sun", "Rain", "Star", "Wind"], correct: 1 },
      { type: "tap", phrase: "the river is long", words: ["the", "river", "tree", "is", "long", "tall"] },
      { type: "listen", question: "What do you hear?", audio: "mountain", display: ["Mto", "Mlima", "Mti", "Jua"], correct: 1 },
    ],
    words: [{ en: "Tree", sw: "Mti" }, { en: "River", sw: "Mto" }, { en: "Mountain", sw: "Mlima" }, { en: "Sun", sw: "Jua" }]
  },
  // ── Unit 6 - NEW: Actions ──
  {
    id: "actions",
    unit: "Unit 6 - Actions & Fun",
    title: "Action Words",
    icon: "🏃",
    category: "verbs",
    guide: `<h4>Action Words - Vitenzi</h4><p>Learn action verbs!</p><h4>Key Words</h4><ul><li><b>Run</b> = Kukimbia</li><li><b>Jump</b> = Kuruka</li><li><b>Eat</b> = Kula</li><li><b>Drink</b> = Kunywa</li><li><b>Sleep</b> = Kulala</li><li><b>Sing</b> = Kuimba</li><li><b>Dance</b> = Kucheza</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Kukimbia' mean?", options: ["Jump", "Run", "Eat", "Sleep"], correct: 1 },
      { type: "fillblank", sentence: "You use your mouth to ___.", answer: "eat", options: ["sleep", "run", "eat", "jump"] },
      { type: "match", pairs: [["Run", "Kukimbia"], ["Jump", "Kuruka"], ["Eat", "Kula"], ["Sleep", "Kulala"]] },
      { type: "multiple", question: "What is 'Kucheza' in English?", options: ["Sing", "Dance", "Sleep", "Run"], correct: 1 },
      { type: "tap", phrase: "I like to dance", words: ["I", "like", "to", "dance", "sing", "run"] },
      { type: "fillblank", sentence: "At night you go to ___.", answer: "sleep", options: ["sleep", "run", "eat", "dance"] },
    ],
    words: [{ en: "Run", sw: "Kukimbia" }, { en: "Jump", sw: "Kuruka" }, { en: "Eat", sw: "Kula" }, { en: "Sleep", sw: "Kulala" }]
  },
  // ── Unit 6 - NEW: Clothes ──
  {
    id: "clothes",
    unit: "Unit 6 - Actions & Fun",
    title: "Clothes",
    icon: "👕",
    category: "vocabulary",
    guide: `<h4>Clothes - Mavazi</h4><p>Learn clothing words!</p><h4>Key Words</h4><ul><li><b>Shirt</b> = Shati</li><li><b>Pants</b> = Suruali</li><li><b>Shoes</b> = Viatu</li><li><b>Hat</b> = Kofia</li><li><b>Dress</b> = Gauni</li><li><b>Socks</b> = Soksi</li></ul>`,
    exercises: [
      { type: "multiple", question: "What does 'Shati' mean?", options: ["Pants", "Shirt", "Shoes", "Hat"], correct: 1 },
      { type: "fillblank", sentence: "You wear ___ on your feet.", answer: "shoes", options: ["shoes", "hat", "shirt", "socks"] },
      { type: "match", pairs: [["Shirt", "Shati"], ["Pants", "Suruali"], ["Shoes", "Viatu"], ["Hat", "Kofia"]] },
      { type: "multiple", question: "What is 'Gauni' in English?", options: ["Socks", "Dress", "Pants", "Hat"], correct: 1 },
      { type: "tap", phrase: "my new shirt", words: ["my", "new", "shirt", "old", "shoes", "hat"] },
      { type: "listen", question: "What do you hear?", audio: "shoes", display: ["Shati", "Suruali", "Viatu", "Kofia"], correct: 2 },
    ],
    words: [{ en: "Shirt", sw: "Shati" }, { en: "Pants", sw: "Suruali" }, { en: "Shoes", sw: "Viatu" }, { en: "Hat", sw: "Kofia" }]
  }
];

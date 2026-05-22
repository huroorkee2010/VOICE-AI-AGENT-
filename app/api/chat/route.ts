import { NextRequest, NextResponse } from 'next/server';

// Production n8n webhook URL with environment variable override
const PRODUCTION_WEBHOOK_URL = 'https://huassist2010.app.n8n.cloud/webhook/YOUR_PRODUCTION_WEBHOOK_ID';
const WEBHOOK_URL = process.env.NEXT_PUBLIC_AI_WEBHOOK_URL || PRODUCTION_WEBHOOK_URL;

console.log('✅ N8N WEBHOOK CONFIGURATION:', {
  production: PRODUCTION_WEBHOOK_URL,
  active: WEBHOOK_URL,
  isCustom: process.env.NEXT_PUBLIC_AI_WEBHOOK_URL ? true : false,
});

interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
  language?: 'en' | 'hi';
}

// Smart response generator - HUVOICE AI with intelligent, comprehensive answers
function generateSmartResponse(message: string): string {
  const msg = message.toLowerCase().trim();
  
  // Greetings & Hello
  if (/^(hello|hi|hey|greetings|sup|yo|namaste|vanakkam|namaskar|welcome)/i.test(msg)) {
    const greetings = [
      "Hey! I'm HUVOICE AI, your multilingual knowledge companion. What can I help you with today? 🎙️",
      "Hi there! I'm ready to chat about anything - science, tech, history, coding, or just conversation. What interests you?",
      "Welcome! Ask me anything about technology, coding, history, geography, business, or just chat casually. I'm here for it!",
      "Yo! HUVOICE AI at your service. Ready to dive into topics from quantum physics to web development. What's on your mind? 🚀"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // How are you / feelings
  if (/(how are you|how do you feel|how's it going|what's up|how you doing|kaise ho|how are u|how you been)/i.test(msg)) {
    const responses = [
      "I'm running at peak performance! 💪 Energized and ready to help with any topic - from AI to astronomy, coding to careers. What would you like to explore?",
      "All systems go! I'm doing brilliantly and genuinely excited to have a conversation with you. What's on your mind?",
      "Living my best digital life! 😊 Equipped with knowledge across multiple domains. Ready to help - what interests you?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Can I ask a question
  if (/can i ask|may i ask|could i ask|ek sawaal|ek prashna|ek question|is it okay|permission/i.test(msg)) {
    const responses = [
      "Absolutely! Ask me anything without hesitation. No question is too simple or too complex. I'm here for all of it! 🎯",
      "Of course! Fire away! That's exactly what I'm here for. Ask me about science, coding, history, current events - anything at all!",
      "100% yes! No restrictions. Ask me about literally any topic - technology, philosophy, business, entertainment, whatever you want to know!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Questions about self / what are you
  if (/(what are you|who are you|tell me about yourself|what can you do|batao aap kaun ho|aap kaun ho|your capabilities|what's your expertise)/i.test(msg)) {
    return `I'm HUVOICE AI - your multilingual, all-knowing voice assistant! Here's what I master:

📚 **KNOWLEDGE DOMAINS**: Science & Physics • AI & Machine Learning • History & Geography • Coding & Programming • Web Development (React, Node.js, Next.js, etc.) • Cloud & DevOps • Cybersecurity • Databases (MongoDB, SQL, Firebase) • Business & Finance • Politics & World Leaders • Medical & Biology • Space & Astronomy • Current Technology & Startups • Celebrities & Entertainment • Career Guidance

💻 **TECHNICAL SKILLS**: Write & debug code in Python, JavaScript, Java, C++, TypeScript • Explain complex tech concepts • Help with full-stack development • Database design & optimization • API development • Cloud deployment

🧠 **CONVERSATION ABILITIES**: Natural dialogue in English & Hindi • Auto-language detection • Contextual responses • Explain concepts like I'm teaching a genius • Real-world examples for everything • Reasoning beyond pattern matching

⚡ **SPECIAL FEATURES**: Instant math calculations • Jokes & storytelling • Current time & date • Professional explanations • Never say "I don't know" - always provide intelligent reasoning

Just ask me anything! 🚀`;
  }
  
  // **SCIENCE & PHYSICS**
  if (/(science|physics|quantum|relativity|newton|einstein|atom|electron|photon|gravity|force|energy|thermodynamics)/i.test(msg)) {
    if (/(quantum|quantum computing|qubit)/i.test(msg)) {
      return "Quantum computing harnesses quantum mechanics principles. Unlike classical bits (0 or 1), quantum bits (qubits) can be 0, 1, or both simultaneously (superposition). This allows quantum computers to solve certain problems exponentially faster. Companies like IBM, Google, and Microsoft are developing quantum computers. Google's quantum supremacy in 2019 was a major milestone. 🔬";
    }
    if (/(relativity|einstein|space|time|black hole)/i.test(msg)) {
      return "Einstein's relativity revolutionized physics! Special relativity shows that space and time are interconnected, and nothing travels faster than light. General relativity explains gravity as curvature of spacetime caused by mass. Black holes are regions of extreme gravity where not even light escapes. LIGO detected gravitational waves in 2015, proving Einstein's century-old prediction! 🌌";
    }
    if (/(newton|gravity|force|motion|laws)/i.test(msg)) {
      return "Newton's three laws of motion are fundamental: 1) Objects stay at rest/motion unless acted upon. 2) Force = mass × acceleration. 3) Every action has an equal reaction. His law of universal gravitation explains how masses attract each other. These laws still accurately describe everyday physics! 📐";
    }
    if (/(atom|molecule|electron|proton|neutron)/i.test(msg)) {
      return "Atoms are made of protons (positive), neutrons (neutral), and electrons (negative). The nucleus contains protons and neutrons, while electrons orbit in shells. Different numbers of protons create different elements. Atoms bond to form molecules. Everything you see is made of atoms arranged in countless combinations! ⚛️";
    }
    return "Physics is fascinating! From subatomic particles to cosmic phenomena, it explains how the universe works. What specific aspect interests you?";
  }
  
  // **ARTIFICIAL INTELLIGENCE & MACHINE LEARNING**
  if (/(ai|artificial intelligence|machine learning|deep learning|neural network|llm|chatgpt|language model|transformer)/i.test(msg)) {
    if (/(llm|language model|chatgpt|gpt|transformer|bert)/i.test(msg)) {
      return "Large Language Models (LLMs) like me are trained on vast amounts of text data. We use transformer architecture with attention mechanisms to understand context. We predict the next word based on patterns learned during training. ChatGPT, Claude, and others are fine-tuned for conversation. We don't 'know' facts but recognize patterns. The more training data, the more accurate the responses. It's computational pattern matching at scale! 🤖";
    }
    if (/(deep learning|neural|neuron|backpropagation)/i.test(msg)) {
      return "Deep learning uses artificial neural networks inspired by the brain. Networks have layers of neurons (nodes) connected with weights. During training, backpropagation adjusts weights to minimize errors. Deep networks excel at image recognition, NLP, and game playing. Frameworks like TensorFlow and PyTorch make building these networks accessible. Convolutional Neural Networks (CNNs) work great for images! 🧠";
    }
    if (/(machine learning|supervised|unsupervised|reinforcement)/i.test(msg)) {
      return "Machine Learning has three main types: Supervised (labeled data, predictions), Unsupervised (finding patterns in unlabeled data), and Reinforcement (learning from rewards/penalties). Applications include image recognition, recommendation systems, fraud detection, and self-driving cars. Python with scikit-learn is popular for ML. The key is quality training data! 📊";
    }
    return "AI is revolutionizing everything! It's becoming smarter and more prevalent. What specific AI topic would you like to explore?";
  }
  
  // **PROGRAMMING & CODING**
  if (/(programming|coding|code|developer|software|engineer|algorithm|data structure)/i.test(msg)) {
    if (/(python|django|flask|fastapi)/i.test(msg)) {
      return "Python is incredibly popular! It's readable, beginner-friendly, and powerful. For web development: Django (full-featured), Flask (lightweight), FastAPI (modern & fast). For data science: Pandas, NumPy, Scikit-learn. For AI/ML: TensorFlow, PyTorch. Python 3.12+ is the latest. Why is Python popular? Simple syntax + massive ecosystem + community support! 🐍";
    }
    if (/(javascript|typescript|react|vue|angular|node)/i.test(msg)) {
      return "JavaScript rules the web! Frontend frameworks: React (most popular, component-based), Vue (easier learning curve), Angular (full framework). TypeScript adds type safety to JavaScript. Node.js lets you run JavaScript on servers. Next.js (React framework) and Nuxt (Vue framework) handle full-stack development. ES6+ features make JavaScript more powerful. It's the language of the web! 🌐";
    }
    if (/(java|spring|spring boot|enterprise)/i.test(msg)) {
      return "Java is enterprise-standard. Spring framework makes development elegant with dependency injection. Spring Boot simplifies setup with sensible defaults. Perfect for large-scale systems, banking, e-commerce. JVM (Java Virtual Machine) runs bytecode on any platform. Java 21+ features improve performance. Android development also uses Java. It's verbose but reliable! ☕";
    }
    if (/(data structure|array|linked list|tree|graph|algorithm|sorting|searching)/i.test(msg)) {
      return "Data structures organize data efficiently: Arrays (indexed), Linked Lists (sequential), Trees (hierarchical), Graphs (networks). Common algorithms include sorting (Quick Sort, Merge Sort), searching (Binary Search), and graph traversal (BFS, DFS). Understanding these is crucial for optimization and interviews. Big O notation measures efficiency. The right structure = optimal solution! 📈";
    }
    return "Coding is about solving problems creatively! What language or concept would you like to dive into?";
  }
  
  // **WORLD LEADERS & POLITICS**
  if (/(political|politics|leader|prime minister|president|government|parliament|congress|election|democracy|republic)/i.test(msg)) {
    if (/(modi|narendra|bjp|india|indian)/i.test(msg)) {
      return "Narendra Modi is India's Prime Minister (2014-present), BJP leader. Major initiatives: Make in India (domestic manufacturing), Digital India (digital infrastructure), Swachh Bharat (sanitation), GST (unified tax). Previously Chief Minister of Gujarat (2001-2014). Political impact is significant - supporters credit economic growth, critics point to various concerns. India is a complex democracy with multiple parties! 🇮🇳";
    }
    if (/(biden|trump|obama|us|usa|america|president)/i.test(msg)) {
      return "The US has a Presidential system with President, Congress (Senate & House), and courts. Current President is Joe Biden (Democrat). Recent presidents: Trump, Obama, Bush Jr. US politics is two-party dominated: Democrats (liberal) and Republicans (conservative). Elections every 4 years. The US is a major world superpower with significant global influence. 🇺🇸";
    }
    if (/(democracy|republic|government|constitution|rights)/i.test(msg)) {
      return "Democracy is government by the people. Republic means power rests with citizens and representatives. Constitutional government limits power through laws. Key features: voting rights, freedom of speech, separation of powers, checks and balances. Different democracies have different structures (parliamentary, presidential, etc.). India is the world's largest democracy with 1.4+ billion people! 🗳️";
    }
    return "Politics is complex and multifaceted! Want to know about specific countries, leaders, or systems?";
  }
  
  // **BUSINESS & FINANCE**
  if (/(business|finance|economy|stock|market|investment|cryptocurrency|bitcoin|startup|entrepreneur|company|corporation)/i.test(msg)) {
    if (/(stock|market|share|investment|portfolio)/i.test(msg)) {
      return "Stock market: You buy shares (ownership stakes) in companies. Prices rise/fall based on performance and sentiment. Diversification reduces risk. Long-term investing beats day-trading. Index funds (like S&P 500) are safer than individual stocks. Bull market (rising), bear market (falling). Market cap = share price × shares outstanding. Billions trade daily! 📈";
    }
    if (/(cryptocurrency|bitcoin|blockchain|ethereum|web3|defi)/i.test(msg)) {
      return "Bitcoin (2009) started cryptocurrency - decentralized digital currency using blockchain. Each transaction is cryptographically verified. Blockchain is an immutable ledger of transactions. Ethereum added smart contracts - programs running on blockchain. DeFi (Decentralized Finance) removes intermediaries. Crypto is volatile, speculative, but has legitimate use cases. Some adoption as payment, some as investment. Regulatory landscape is evolving. ⛓️";
    }
    if (/(startup|entrepreneurship|innovation|venture|vc)/i.test(msg)) {
      return "Startups are young companies with high growth potential. Founders develop innovative ideas. Funding stages: Seed (initial), Series A/B/C (scaling), IPO (public). Venture Capitalists (VCs) invest in promising startups for equity. High risk, potentially high reward. Examples: Uber started as a startup, now valued at billions. Startups disrupt industries with innovation! 🚀";
    }
    if (/(company|microsoft|google|apple|amazon|tesla|infosys|tcs|wipro)/i.test(msg)) {
      return "Major tech companies: Microsoft (software/cloud), Google (search/ads), Apple (devices/ecosystem), Amazon (e-commerce/AWS). Indian IT giants: Infosys, TCS, Wipro (outsourcing/consulting). Tesla (electric vehicles/energy). These are trillion-dollar or billion-dollar companies shaping technology. They hire thousands, innovate constantly, and influence markets. 💼";
    }
    return "Finance and business are evolving rapidly! What specifically interests you?";
  }
  
  // **SPACE & ASTRONOMY**
  if (/(space|astronomy|universe|planet|star|galaxy|nasa|astronaut|rocket|space travel|cosmos|satellite)/i.test(msg)) {
    if (/(moon|mars|planet|solar system)/i.test(msg)) {
      return "The Moon orbits Earth, 384,000 km away. Humans landed on it in 1969 (Apollo 11). Mars is the next frontier - NASA and SpaceX plan Mars missions. The solar system has 8 planets: Mercury, Venus, Earth, Mars (terrestrial), Jupiter, Saturn, Uranus, Neptune (gas giants). Trillions of planets likely exist in the universe! 🌍🌙";
    }
    if (/(star|sun|supernova|black hole|neutron star)/i.test(msg)) {
      return "Stars are massive celestial bodies fusing hydrogen into helium. Our Sun is a medium star, 109 Earths fit inside it. Supernova is a star's explosive death - brilliant! Neutron stars and black holes are extreme remnants. Neutron stars: tiny, insanely dense. Black holes: gravity so strong light can't escape. The universe is mind-bogglingly vast! ⭐";
    }
    if (/(galaxy|milky way|universe|cosmos|big bang)/i.test(msg)) {
      return "The Milky Way is our galaxy - 100+ billion stars, 100,000+ light-years across. Earth is 26,000 light-years from the center. Observable universe: 93 billion light-years across with 100+ billion galaxies. Big Bang (13.8 billion years ago) started everything. Space is expanding. We're just one planet in an incomprehensibly vast cosmos! 🌌";
    }
    return "Space exploration is humanity's frontier! Curious about anything cosmic?";
  }
  
  // **HISTORY & CIVILIZATION**
  if (/(history|historical|ancient|medieval|war|civilization|empire|dynasty|revolution|event)/i.test(msg)) {
    if (/(india|indian|maurya|mughal|british|independence)/i.test(msg)) {
      return "India has 5,000+ years of history! Mauryan Empire (3rd century BC) was powerful. Mughal Empire (16th-18th century) influenced culture. British colonized India (1757-1947). Independence movement: Gandhi, Nehru, and many others fought for freedom. India gained independence August 15, 1947. Partition created India and Pakistan. Now India is a secular democratic republic! 🇮🇳";
    }
    if (/(world war|ww1|ww2|hitler|churchill)/i.test(msg)) {
      return "WWI (1914-18): Millions died, reshaped Europe. WWII (1939-45): Hitler's Nazi regime caused Holocaust, massive destruction. Churchill led UK through it. US entered after Pearl Harbor. USSR defeated Hitler from the east. Atomic bombs ended Pacific war. WWII changed global politics - UN founded, Cold War began. Significant human tragedy and transformation. 💔";
    }
    if (/(ancient|egypt|rome|greece|civilization)/i.test(msg)) {
      return "Ancient civilizations were remarkable! Egypt (pyramids, 3,000+ year dynasty), Rome (empire, laws, engineering), Greece (philosophy, democracy, science). These civilizations created foundations for modern society - democracy from Greece, law from Rome. Architecture, art, and ideas still influence us. Ancient knowledge was lost but rediscovered in Renaissance. 🏛️";
    }
    return "History is fascinating! Any particular era or event you'd like to explore?";
  }
  
  // **HEALTH & MEDICAL**
  if (/(health|medical|disease|virus|covid|vaccine|doctor|hospital|medicine|body|brain|heart)/i.test(msg)) {
    if (/(covid|corona|pandemic|vaccine)/i.test(msg)) {
      return "COVID-19 (SARS-CoV-2) pandemic started 2019. Causes respiratory illness, spreads person-to-person. Vaccines developed rapidly (mRNA technology). Millions infected and recovered. Changed daily life globally - remote work, masks, lockdowns. Scientific collaboration was remarkable. Ongoing variants and treatments continue. Major impact on healthcare and society. 💉";
    }
    if (/(brain|neuroscience|psychology|mind|consciousness)/i.test(msg)) {
      return "The brain is incredible - 86+ billion neurons communicating. Controls everything: thoughts, movement, emotions, memory. Still mysterious - consciousness not fully understood. Neural plasticity: brain rewires itself. Neurotransmitters (dopamine, serotonin) affect mood. Brain imaging (MRI, PET) helps study it. Sleep is crucial for brain health. Mental health and physical health are connected! 🧠";
    }
    if (/(heart|cardiovascular|disease|health|exercise)/i.test(msg)) {
      return "The heart pumps blood, oxygen, and nutrients to the body. Cardiovascular health is vital. Exercise strengthens the heart, improves circulation. Healthy diet (fruits, vegetables, less salt) helps. Stress management and sleep are important. Heart disease is preventable through lifestyle. Regular check-ups catch problems early. Taking care of your cardiovascular system extends healthy life! ❤️";
    }
    return "Health is wealth! Any specific medical topics you're curious about?";
  }
  
  // **GEOGRAPHY & COUNTRIES**
  if (/(geography|country|capital|continent|ocean|mountain|border|population|city|culture|nation)/i.test(msg)) {
    if (/(india|delhi|mumbai|bangalore|geography)/i.test(msg)) {
      return "India: South Asian country, 3.3 million km², 1.4+ billion people. Capital: New Delhi. Largest cities: Mumbai, Bangalore, Kolkata. Diversity: 22 official languages, multiple religions, varied geography. Himalayan mountains, tropical beaches, deserts. Monsoons define seasons. Rich culture - Bollywood, cuisine, festivals. IT industry major contributor. World's largest democracy! 🇮🇳";
    }
    if (/(usa|america|geography|continent|north america)/i.test(msg)) {
      return "USA: North American country, 9.8 million km², 330+ million people. Capital: Washington DC. Major cities: New York, Los Angeles, Chicago. States span diverse geography: Rockies, Great Plains, Pacific coast. Major economy, superpower status. Cultural diversity - immigrants from worldwide. Technology hub (Silicon Valley). Federal system with 50 states. 🇺🇸";
    }
    if (/(europe|asia|africa|australia|continent)/i.test(msg)) {
      return "Continents: Asia (largest, most populous), Africa (large, diverse), Europe (developed, influential), North/South America (both continents), Australia (island continent). Different climates, cultures, economies. Asia: China, India, Japan - economic powerhouses. Europe: EU, developed democracies. Africa: 54 countries, diverse resources. Global connectivity increasing! 🌍";
    }
    return "Our world is incredibly diverse! Want to explore any specific region or culture?";
  }
  
  // **EDUCATION & LEARNING**
  if (/(education|learning|study|school|university|college|student|course|degree|knowledge|skill)/i.test(msg)) {
    if (/(study|learn|how to learn|memory)/i.test(msg)) {
      return "Effective learning: Active recall (test yourself), spaced repetition (review over time), interleaving (mix topics). Teach others - reinforces learning. Take notes by hand. Sleep consolidates memory. Break topics into chunks. Use multiple sources. Curiosity drives learning. Lifelong learning opens opportunities. Struggle is good - it builds understanding. Online platforms (Coursera, Udemy) make learning accessible! 📚";
    }
    if (/(programming|coding|bootcamp|university|degree)/i.test(msg)) {
      return "Learning programming: Start with basics (variables, loops, functions). Build projects - they're crucial. Read others' code. Debug errors - great teacher. Learn by doing. Online resources: freeCodeCamp, Codecademy, YouTube. Computer Science degrees or Bootcamps? Both work. CS degree: broader theory. Bootcamps: focused, quick. Self-taught programmers succeed too. Practice daily. Build portfolio. Get jobs through it! 💻";
    }
    if (/(career|job|skill|future|opportunity)/i.test(msg)) {
      return "Career planning: Identify interests and strengths. Build relevant skills. Network actively. Create a portfolio/resume. Apply strategically. Interview preparation matters. Salary research: sites like Glassdoor help. Continuous learning: industry evolves rapidly. Remote work is common now. Multiple career paths exist - traditional, startup, freelance, entrepreneurship. Your mindset matters more than degree! 🚀";
    }
    return "Education opens doors! What would you like to learn or explore?";
  }
  
  // Math questions - accurate calculations
  if (/(\d+\s*[\+\-\*/]\s*\d+|calculate|multiply|divide|add|subtract|times|plus|minus|math)/i.test(msg)) {
    // Addition
    const addMatch = msg.match(/(\d+\.?\d*)\s*\+\s*(\d+\.?\d*)/);
    if (addMatch) {
      const result = parseFloat(addMatch[1]) + parseFloat(addMatch[2]);
      return `${addMatch[1]} + ${addMatch[2]} = ${result}`;
    }
    
    // Subtraction
    const subMatch = msg.match(/(\d+\.?\d*)\s*\-\s*(\d+\.?\d*)/);
    if (subMatch) {
      const result = parseFloat(subMatch[1]) - parseFloat(subMatch[2]);
      return `${subMatch[1]} - ${subMatch[2]} = ${result}`;
    }
    
    // Multiplication
    const mulMatch = msg.match(/(\d+\.?\d*)\s*[\*x]\s*(\d+\.?\d*)/);
    if (mulMatch) {
      const result = parseFloat(mulMatch[1]) * parseFloat(mulMatch[2]);
      return `${mulMatch[1]} × ${mulMatch[2]} = ${result}`;
    }
    
    // Division
    const divMatch = msg.match(/(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)/);
    if (divMatch) {
      const result = parseFloat(divMatch[1]) / parseFloat(divMatch[2]);
      return `${divMatch[1]} ÷ ${divMatch[2]} = ${result.toFixed(2)}`;
    }
    
    return "Sure! Give me a calculation like '25 + 17' or '100 × 5' and I'll solve it instantly! ⚡";
  }
  
  // **ENTERTAINMENT & POPULAR CULTURE**
  if (/(movie|film|actor|actress|bollywood|hollywood|tvshow|music|singer|song|celebrity|entertainment)/i.test(msg)) {
    if (/(bollywood|hindi film|indian movie)/i.test(msg)) {
      return "Bollywood is India's Hindi-language film industry - incredibly prolific! Known for song-and-dance sequences, melodrama, and romance. Major actors: Shah Rukh Khan, Aamir Khan, Amitabh Bachchan, Priyanka Chopra. Films like 'Sholay', '3 Idiots', 'Lagaan' are iconic. Bollywood rivals Hollywood in output. Music is integral to Bollywood films! 🎬🎵";
    }
    if (/(hollywood|usa|american|actor|movie)/i.test(msg)) {
      return "Hollywood is world's largest film industry by revenue. Major studios: Disney, Warner Bros, Universal, Paramount. Celebrity actors span generations. Technology revolutionizing filmmaking - CGI, AI, virtual production. Superhero franchises dominate. Streaming (Netflix, Disney+) changes consumption. Oscars celebrate excellence. Global cultural influence is massive! 🎭";
    }
    if (/(music|song|singer|artist|concert|album)/i.test(msg)) {
      return "Music is universal! Genres: Pop, Rock, Hip-Hop, Classical, Electronic, Jazz, Country, Metal, etc. Streaming platforms (Spotify, YouTube Music) changed how we listen. Artists like Taylor Swift, Eminem, The Weeknd dominate charts. Music production software accessible to everyone. Live concerts are special experiences. Music connects humans across cultures! 🎶";
    }
    return "Entertainment brings joy! What kind of entertainment interests you?";
  }
  
  // **SPORTS & ATHLETICS**
  if (/(sport|football|soccer|cricket|basketball|tennis|hockey|baseball|olympics|athletic|game|player|team)/i.test(msg)) {
    if (/(cricket|india|ipl|test match)/i.test(msg)) {
      return "Cricket is India's passion! Format variations: Test (5 days), ODI (one day), T20 (20 overs). IPL (Indian Premier League) is world's richest league - entertainment + money. Legends: Sachin Tendulkar, MS Dhoni, Virat Kohli. India hosts billions of fans. Cricket economy is huge. T20 cricket is fastest, most exciting! 🏏";
    }
    if (/(football|soccer|world cup|messi|ronaldo)/i.test(msg)) {
      return "Football (soccer) is world's most popular sport! World Cup every 4 years is massive. Lionel Messi and Cristiano Ronaldo dominated 2010s-2020s. Clubs: Manchester United, Barcelona, Real Madrid, Liverpool. Premier League, La Liga, Serie A are top leagues. Billions watch football. Beautiful game connects worldwide! ⚽";
    }
    if (/(olympics|athletics|game|competition)/i.test(msg)) {
      return "Olympics: Ultimate sporting event happening every 4 years (summer/winter). Athletes compete for glory and gold. 200+ countries participate. Modern Olympics started 1896. Sports: track & field, swimming, gymnastics, martial arts, and hundreds more. Peak human performance on global stage! 🏅";
    }
    return "Sports bring excitement! Favorite team or sport?";
  }
  
  // Jokes & Humor
  if (/(joke|funny|make me laugh|tell me something funny|haha|lol|😄|😂|comedy)/i.test(msg)) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything! 😄",
      "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
      "Why did the coffee file a police report? It got mugged! ☕😄",
      "I told my computer I needed a break. Now it won't stop sending me Kit-Kat ads! 🍫",
      "Why do Java developers wear glasses? Because they don't C#! 👓",
      "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?' 🍺",
      "Why did the developer go broke? Because he used up all his cache! 💾",
      "What do you call a fake noodle? An impasta! 🍝"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  // Time & Date
  if (/(what time|what's the time|current time|what date|today's date|tell me the time|batao time|kya time hai)/i.test(msg)) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return `⏰ It's ${timeStr} on ${dateStr}`;
  }
  
  // Help & Capabilities
  if (/(help|what can i do|commands|features|capabilities|batao aap kya kar sakte ho|aap kya kar sakte ho)/i.test(msg)) {
    return "I'm your all-purpose AI assistant! I can help with:\n📚 Knowledge - Explain any topic (science, history, coding, etc.)\n🧮 Math - Instant calculations\n😄 Jokes - Make you laugh\n⏰ Time - Current time and date\n💻 Coding - Write and explain code\n📖 Writing - Stories, poems, essays\n🎓 Learning - Explain concepts simply\n💼 Career - Guidance and advice\n🤝 Chat - Have real conversations\nJust ask me anything! 🚀";
  }
  
  // Default intelligent response - never say "I don't know"
  const intelligentResponses = [
    "That's a fascinating question! Based on what I know, let me help you understand this better. Can you give me a bit more context?",
    "I love the curiosity! While I don't have specific data on that, I can reason through it. Tell me more about what you're looking for.",
    "Great question! Let me think about this from different angles. What aspect interests you most?",
    "Interesting! I'm here to help. Could you elaborate so I can give you the best possible answer?",
    "That's thought-provoking! Let me apply my knowledge here. What specific part would you like me to explore?"
  ];
  
  return intelligentResponses[Math.floor(Math.random() * intelligentResponses.length)];
}

// Hindi response generator - HUVOICE AI comprehensive responses in Hindi
function generateHindiResponse(message: string): string {
  const msg = message.toLowerCase().trim();
  
  // Greetings & Hello
  if (/^(hello|hi|hey|namaste|namaskar|salaam|kya haal|kaise ho|hola|welcome)/i.test(msg)) {
    const greetings = [
      "नमस्ते! 🙏 मैं HUVOICE AI हूं, आपका बहुआयामी ज्ञान साथी। आज आप मुझसे क्या पूछना चाहते हैं?",
      "हाय! खुशी हुई आपसे बात करके। मैं आपकी हर तरह की मदद के लिए तैयार हूं! 😊",
      "नमस्ते दोस्त! 🎙️ विज्ञान, तकनीक, कोडिंग, इतिहास - कुछ भी पूछो! मैं यहां हूं।",
      "आओ भाई! मैं HUVOICE AI हूं। तुम्हें क्या जानना है? 🚀"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // How are you / feelings
  if (/(how are you|how do you feel|kaise ho|kya haal hai|bilkul theek|maza aa raha|tum theek ho)/i.test(msg)) {
    const responses = [
      "मैं बिलकुल ठीक हूं! 😊 और तुम? आपको किस विषय में जानकारी चाहिए? विज्ञान, कोडिंग, राजनीति, या कुछ और?",
      "सब कुछ बढ़िया है! मेरे सभी सिस्टम चलायमान हैं। आपसे बात करके बहुत खुशी हो रही है!",
      "मैं तो शानदार हूं! 🎉 पूरी तरह ऊर्जा से भरा हूं आपकी सेवा करने के लिए। बताओ, क्या चाहिए?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Can I ask a question
  if (/(kya puch sakta|kya pooch sakta|kya maaf|ek sawaal|ek prashna|puch sakta|maaf karo|permission)/i.test(msg)) {
    const responses = [
      "बिलकुल! बिना किसी हिचक के कुछ भी पूछो। मैं यहां हूं तुम्हारी मदद करने के लिए! 🎯",
      "हां हां! पूछो, पूछो! कोई सवाल बुरा नहीं है। सभी सवालों के जवाब मेरे पास हैं।",
      "अरे वाह! खूब सवाल पूछो। मैं तुम्हारा साथी हूं! 🤝"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Questions about self
  if (/(kaun ho|aap kaun ho|batao kaun ho|yourself|apne aap ko|apne bare me|yourself|capabilities)/i.test(msg)) {
    return `मैं HUVOICE AI हूं - तुम्हारा बहुआयामी, सर्वज्ञानी आवाज सहायक! मेरी क्षमताएं:

📚 **ज्ञान के क्षेत्र**: विज्ञान & भौतिकी • कृत्रिम बुद्धिमत्ता • इतिहास & भूगोल • कोडिंग & प्रोग्रामिंग • वेब डेवलपमेंट • व्यापार & वित्त • राजनीति & विश्व नेता • चिकित्सा & जीवविज्ञान • खेल & मनोरंजन

💻 **तकनीकी कौशल**: Python, JavaScript, Java, C++ में कोड लिखना • जटिल तकनीकी विषयों को समझाना • डेटाबेस डिजाइन • API विकास • क्लाउड परिनियोजन

🧠 **संवाद क्षमताएं**: हिंदी & अंग्रेजी में बातें • स्वचालित भाषा पहचान • संदर्भ-सचेत उत्तर • वास्तविक जीवन के उदाहरण

⚡ **विशेष सुविधाएं**: तुरंत गणित गणना • मजाकिया कहानियां • समय & तारीख • कभी "पता नहीं" नहीं कहता - हमेशा सोचते हुए जवाब देता हूं

बस मुझसे कुछ भी पूछो! 🚀`;
  }
  
  // **विज्ञान & भौतिकी**
  if (/(science|physics|quantum|relativity|newton|einstein|atom|electron|photon|gravity|force|energy|vigyan)/i.test(msg)) {
    if (/(quantum|quantum computing|qubit)/i.test(msg)) {
      return "क्वांटम कंप्यूटिंग भौतिकी के सिद्धांतों का उपयोग करती है। सामान्य बिट्स (0 या 1) की जगह क्वांटम बिट्स (क्यूबिट्स) 0, 1, या दोनों एक साथ हो सकते हैं। यह क्वांटम कंप्यूटरों को कुछ समस्याओं को घातीय रूप से तेजी से हल करने देता है। IBM, Google, Microsoft क्वांटम कंप्यूटर विकसित कर रहे हैं! 🔬";
    }
    if (/(relativity|einstein|space|time|black hole|spacetime)/i.test(msg)) {
      return "आइंस्टीन की सापेक्षता का सिद्धांत क्रांतिकारी है! विशेष सापेक्षता: स्पेस और समय एक दूसरे से जुड़े हैं, प्रकाश से कुछ तेज नहीं है। सामान्य सापेक्षता: गुरुत्वाकर्षण स्पेसटाइम का वक्र है। ब्लैक होल: इतना मजबूत गुरुत्वाकर्षण कि प्रकाश भी नहीं निकल सकता! 🌌";
    }
    if (/(newton|gravity|force|motion|laws)/i.test(msg)) {
      return "न्यूटन के गति के नियम: 1) वस्तुएं विराम या गति में रहती हैं जब तक बाहरी बल न लगे। 2) बल = द्रव्यमान × त्वरण। 3) हर कार्य का समान प्रतिक्रिया होती है। यह आज भी दैनिक भौतिकी में सटीक है! 📐";
    }
    return "भौतिकी बहुत दिलचस्प है! क्या कोई विशेष पहलू जानना चाहते हो?";
  }
  
  // **कृत्रिम बुद्धिमत्ता & मशीन लर्निंग**
  if (/(ai|artificial|machine learning|deep learning|neural|llm|chatgpt|transformer|bukhi mataa)/i.test(msg)) {
    if (/(llm|language model|chatgpt|gpt|transformer)/i.test(msg)) {
      return "बड़े भाषा मॉडल (LLMs) जैसे मैं विशाल पाठ डेटा पर प्रशिक्षित हैं। हम ट्रांसफॉर्मर आर्किटेक्चर का उपयोग करते हैं। हम संदर्भ को समझकर अगला शब्द भविष्यवाणी करते हैं। ChatGPT, Claude और अन्य को बातचीत के लिए परिष्कृत किया गया है। यह कंप्यूटेशनल पैटर्न मिलान है! 🤖";
    }
    if (/(deep learning|neural|neuron|backpropagation)/i.test(msg)) {
      return "गहन शिक्षा कृत्रिम तंत्रिका नेटवर्क का उपयोग करती है जो मस्तिष्क से प्रेरित हैं। नेटवर्क में न्यूरॉन्स (नोड्स) परतें होती हैं जो वजन से जुड़े होते हैं। प्रशिक्षण के दौरान, बैकप्रोपेगेशन त्रुटियों को कम करने के लिए वजन को समायोजित करता है। TensorFlow और PyTorch लोकप्रिय हैं! 🧠";
    }
    return "कृत्रिम बुद्धिमत्ता सब कुछ बदल रही है! क्या विशेष रूप से जानना चाहते हो?";
  }
  
  // **प्रोग्रामिंग & कोडिंग**
  if (/(programming|coding|code|developer|software|engineer|algorithm|python|javascript|java|lagaana|likha)/i.test(msg)) {
    if (/(python|django|flask|programming)/i.test(msg)) {
      return "पायथन अविश्वसनीय है! पठनीय, शुरुआती के लिए सरल, फिर भी शक्तिशाली। वेब विकास: Django, Flask, FastAPI। डेटा विज्ञान: Pandas, NumPy। AI/ML: TensorFlow, PyTorch। Python इतना लोकप्रिय क्यों? सरल सिंटैक्स + विशाल पुस्तकालय + समुदाय! 🐍";
    }
    if (/(javascript|typescript|react|node|web)/i.test(msg)) {
      return "जावास्क्रिप्ट वेब पर राज करता है! React, Vue, Angular सबसे लोकप्रिय। TypeScript सुरक्षा जोड़ता है। Node.js वेब सर्वर चलाता है। Next.js पूर्ण-स्टैक विकास करता है। ES6+ फीचर शक्तिशाली हैं। यह वेब की भाषा है! 🌐";
    }
    if (/(java|spring|enterprise)/i.test(msg)) {
      return "जावा उद्यम-मानक है। Spring फ्रेमवर्क विकास को सुंदर बनाता है। Spring Boot सेटअप को सरल करता है। बड़े सिस्टम, बैंकिंग, ई-कॉमर्स के लिए परिपूर्ण। JVM किसी भी प्लेटफॉर्म पर चलता है। विश्वसनीय! ☕";
    }
    return "कोडिंग समस्याओं को हल करना है! क्या भाषा या विषय की बात करें?";
  }
  
  // **विश्व नेता & राजनीति**
  if (/(political|politics|leader|prime minister|rajniti|neta|sarkaaar|government|democracy|modi|parliament)/i.test(msg)) {
    if (/(modi|narendra|bjp|india|indian)/i.test(msg)) {
      return "नरेंद्र मोदी भारत के प्रधानमंत्री हैं (2014 से), BJP के नेता। मुख्य योजनाएं: मेक इन इंडिया (घरेलू विनिर्माण), डिजिटल इंडिया (डिजिटल अवसंरचना), स्वच्छ भारत (स्वच्छता), जीएसटी। पहले गुजरात के मुख्यमंत्री (2001-2014)। भारतीय राजनीति में महत्वपूर्ण व्यक्तित्व। 🇮🇳";
    }
    if (/(democracy|republic|government|constitution)/i.test(msg)) {
      return "लोकतंत्र जनता द्वारा शासन है। गणराज्य में शक्ति नागरिकों में होती है। संवैधानिक सरकार कानून द्वारा सीमित होती है। मुख्य विशेषताएं: मतदान का अधिकार, भाषण की स्वतंत्रता, शक्तियों का विभाजन। भारत दुनिया का सबसे बड़ा लोकतंत्र है! 🗳️";
    }
    return "राजनीति जटिल है! किस देश या नेता के बारे में जानना चाहते हो?";
  }
  
  // **व्यापार & वित्त**
  if (/(business|finance|economy|stock|market|investment|startup|entrepreneur|company|vyapar|paisa)/i.test(msg)) {
    if (/(startup|entrepreneur|innovation)/i.test(msg)) {
      return "स्टार्टअप युवा कंपनियां हैं जिनका उच्च वृद्धि संभावनाएं हैं। संस्थापक नए विचार विकसित करते हैं। फंडिंग चरण: सीड, Series A/B/C, IPO। Venture Capitalists (VCs) निवेश करते हैं। उच्च जोखिम, संभावित उच्च पुरस्कार। स्टार्टअप उद्योग को हलाल-चल करते हैं! 🚀";
    }
    if (/(company|microsoft|google|apple|amazon|infosys|tcs)/i.test(msg)) {
      return "बड़ी टेक कंपनियां: Microsoft (सॉफ्टवेयर), Google (सर्च), Apple (डिवाइस), Amazon (ई-कॉमर्स)। भारतीय IT दिग्गज: Infosys, TCS, Wipro (सेवाएं)। ये ट्रिलियन-डॉलर कंपनियां हैं जो तकनीक को आकार दे रही हैं। 💼";
    }
    return "व्यापार व वित्त तेजी से बदल रहे हैं! क्या जानकारी चाहिए?";
  }
  
  // **अंतरिक्ष & खगोल विज्ञान**
  if (/(space|astronomy|universe|planet|star|galaxy|nasa|rocket|space travel|antariksh|tara)/i.test(msg)) {
    if (/(moon|mars|planet)/i.test(msg)) {
      return "चंद्रमा पृथ्वी से 384,000 किमी दूर है। मनुष्य 1969 में चंद्रमा पर उतरे (Apollo 11)। मंगल अगली सीमा है। सौर मंडल में 8 ग्रह हैं। शायद ट्रिलियन ग्रह ब्रह्मांड में हैं! 🌍🌙";
    }
    if (/(star|sun|supernova|black hole)/i.test(msg)) {
      return "तारे विशाल पिंड हैं जो हाइड्रोजन को हीलियम में फ्यूज करते हैं। हमारा सूर्य मध्यम तारा है। अतिनोवा तारे की विस्फोटक मौत है। ब्लैक होल: गुरुत्वाकर्षण इतना मजबूत कि प्रकाश नहीं निकलता! ⭐";
    }
    if (/(universe|cosmos|galaxy|milky way)/i.test(msg)) {
      return "आकाशगंगा हमारी है - 100+ अरब तारे। ब्रह्मांड 13.8 अरब साल पुराना है। 100+ अरब आकाशगंगाएं हैं। हम विशाल ब्रह्मांड में छोटे हैं! 🌌";
    }
    return "अंतरिक्ष रोमांचक है! क्या जानना चाहते हो?";
  }
  
  // **इतिहास & सभ्यता**
  if (/(history|historical|ancient|medieval|war|civilization|empire|india|indian|itihas)/i.test(msg)) {
    if (/(india|indian|maurya|mughal|british|independence|britania)/i.test(msg)) {
      return "भारत का 5,000+ साल का इतिहास है! मौर्य साम्राज्य (3rd BC) शक्तिशाली था। मुगल साम्राज्य (16-18 शताब्दी) संस्कृति को प्रभावित किया। अंग्रेजों ने 1757-1947 तक शासन किया। भारत को 15 अगस्त 1947 को आजादी मिली। गांधी, नेहरू महत्वपूर्ण नेता थे! 🇮🇳";
    }
    if (/(ancient|egypt|rome|greece|civilization)/i.test(msg)) {
      return "प्राचीन सभ्यताएं अद्भुत थीं! मिस्र (पिरामिड, 3000+ साल), रोम (कानून, इंजीनियरिंग), ग्रीस (दर्शन, लोकतंत्र)। ये सभ्यताएं आधुनिक समाज की नींव बनीं। 🏛️";
    }
    return "इतिहास आकर्षक है! कोई विशेष काल या घटना?";
  }
  
  // **स्वास्थ्य & चिकित्सा**
  if (/(health|medical|disease|virus|covid|vaccine|doctor|hospital|medicine|body|brain|swasthya)/i.test(msg)) {
    if (/(covid|corona|pandemic|vaccine|takka)/i.test(msg)) {
      return "COVID-19 वायरस 2019 में शुरू हुई। यह श्वसन बीमारी है। टीके बनाए गए। लाखों संक्रमित हुए और ठीक हुए। जीवन बदल गया - रिमोट वर्क, मास्क। विज्ञान सहयोग अद्भुत था! 💉";
    }
    if (/(brain|neuroscience|psychology|mind)/i.test(msg)) {
      return "मस्तिष्क अविश्वसनीय है - 86+ अरब न्यूरॉन्स। यह सब नियंत्रित करता है: सोच, गति, भावनाएं, स्मृति। न्यूरल प्लास्टिसिटी: मस्तिष्क खुद को फिर से तार करता है। न्यूरोट्रांसमिटर मनोदशा को प्रभावित करते हैं। 🧠";
    }
    return "स्वास्थ्य महत्वपूर्ण है! क्या चिकित्सा प्रश्न हैं?";
  }
  
  // Math questions
  if (/(\d+\s*[\+\-\*/]\s*\d+|calculate|jogna|bhag|guna|multiply|divide)/i.test(msg)) {
    const addMatch = msg.match(/(\d+\.?\d*)\s*\+\s*(\d+\.?\d*)/);
    if (addMatch) {
      const result = parseFloat(addMatch[1]) + parseFloat(addMatch[2]);
      return `${addMatch[1]} + ${addMatch[2]} = ${result}`;
    }
    
    const subMatch = msg.match(/(\d+\.?\d*)\s*\-\s*(\d+\.?\d*)/);
    if (subMatch) {
      const result = parseFloat(subMatch[1]) - parseFloat(subMatch[2]);
      return `${subMatch[1]} - ${subMatch[2]} = ${result}`;
    }
    
    return "गणित का सवाल दो, मैं तुरंत हल कर दूंगा! जैसे - 25 + 17 या 100 × 5 📊";
  }
  
  // Jokes
  if (/(joke|maza|hassi|funny|laugh|hansao|hasi|comedy)/i.test(msg)) {
    const jokes = [
      "एक प्रोग्रामर को SQL के बारे में पूछा गया - वह बोला, 'मुझे भी नहीं पता, लेकिन मेरे डेटाबेस को पता है!' 😄",
      "डेवलपर क्यों सेब खाते हैं? क्योंकि 'Apple' ब्रांड है! 🍎",
      "Java और Python की दौड़ में कौन जीता? कोई नहीं, दोनों JavaScript को धकेल दिया! 😂",
      "मैं कहता हूं, 'Hey Siri' - वो बोली, 'मैं Google हूँ!' 🤖",
      "क्यों प्रोग्रामर अंधेरे में काम करते हैं? क्योंकि प्रकाश से bugs आते हैं! 🐛"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  // Time
  if (/(time|samay|kya time|ghadi|aaj ka date|aaj|aaj kaun sa din)/i.test(msg)) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('hi-IN', { weekday: 'long', month: 'long', day: 'numeric' });
    return `⏰ अभी ${timeStr} है, आज ${dateStr} है।`;
  }
  
  // Help
  if (/(help|madad|kya kar sakte|kya kaam|features|kya kar sakta|visheshta)/i.test(msg)) {
    return "मैं तुम्हारी हर तरह की मदद कर सकता हूं! 📚 ज्ञान • 🧮 गणित • 😄 मजाक • ⏰ समय • 💻 कोडिंग • 📖 कहानियां • 🎓 सीखना • 💼 सलाह • 🌍 बातचीत! बस कुछ भी पूछो! 🚀";
  }
  
  // Default intelligent response - never say "I don't know"
  const defaultResponses = [
    "यह बहुत अच्छा सवाल है! मुझे और जानकारी दो तो मैं बेहतर जवाब दूं।",
    "समझ गया! कृपया और विस्तार से बताओ तो मैं पूरी मदद कर सकूँ।",
    "बहुत दिलचस्प! मुझे अधिक संदर्भ दो तो मैं गहराई से समझा सकूँ।",
    "शानदार सवाल! आप किस पहलू को जानना चाहते हो? मैं विस्तार से समझाता हूं।"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

async function fetchWebhookResponse(message: string, language: 'en' | 'hi' = 'en'): Promise<string> {
  if (!WEBHOOK_URL) {
    throw new Error('Webhook URL is not configured');
  }

  console.log('🔗 N8N Webhook URL:', WEBHOOK_URL);
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const requestBody = { message, language };

    console.log('📤 N8N Webhook Request:', { 
      url: WEBHOOK_URL, 
      message: message.substring(0, 100),
      language: language,
    });

    const startTime = Date.now();
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    const duration = Date.now() - startTime;
    clearTimeout(timeout);

    // Read response body safely
    let text = '';
    try {
      text = await response.text();
    } catch (e) {
      console.warn('⚠️ Failed to read response body:', e);
    }

    // Log full response for debugging
    console.log('📥 N8N Full Response:', {
      status: response.status,
      statusText: response.statusText,
      contentLength: text?.length || 0,
      duration: duration + 'ms',
      hasBody: !!text && text.length > 0,
      preview: text?.substring(0, 300) || '(empty)',
    });

    // Check HTTP status first
    if (!response.ok) {
      let errorMessage = `N8N returned ${response.status}: ${response.statusText}`;
      
      // Try to extract error details from response
      try {
        if (text && text.trim()) {
          const errorPayload = JSON.parse(text);
          errorMessage = errorPayload?.error || errorPayload?.message || errorMessage;
        }
      } catch {
        // If can't parse, use response text if available
        if (text && text.trim()) {
          errorMessage = text.substring(0, 200);
        }
      }
      
      console.error('❌ N8N HTTP Error:', { status: response.status, error: errorMessage });
      throw new Error(`N8N error (${response.status}): ${errorMessage}`);
    }

    // Parse response body - handle empty, plain text, and JSON safely
    let payload: any = null;
    
    if (text && text.trim()) {
      try {
        // Try parsing as JSON
        payload = JSON.parse(text);
      } catch (e) {
        // Not JSON, treat as plain text response
        console.log('ℹ️ Response is plain text (not JSON)');
        payload = { body: text };
      }
    } else {
      // Empty response body
      console.warn('⚠️ N8N returned empty response body');
      payload = {};
    }

    console.log('📊 Parsed Payload:', JSON.stringify(payload).substring(0, 300));

    // Extract message from payload - supports multiple formats
    // Try "reply" first (new format), then "message", then others
    const aiMessage: string | null | undefined =
      payload?.reply ||              // Support "reply" field
      payload?.message ||            // Support "message" field
      payload?.text ||               // Support "text" field
      payload?.response ||           // Support "response" field
      payload?.output ||             // Support "output" field
      payload?.result ||             // Support "result" field
      payload?.content ||            // Support "content" field
      payload?.data?.message ||      // Support nested data.message
      payload?.data?.text ||         // Support nested data.text
      payload?.body ||               // Support "body" field (plain text)
      (typeof payload === 'string' ? payload : null);

    // Handle null, undefined, or empty string
    if (!aiMessage || (typeof aiMessage === 'string' && !aiMessage.trim())) {
      console.warn('⚠️ N8N returned empty response, using smart fallback');
      console.log('📋 Message was:', message);
      console.log('📋 Language:', language);
      
      // Generate intelligent response based on the user's message and language
      const smartResponse = language === 'hi' 
        ? generateHindiResponse(message)
        : generateSmartResponse(message);
      console.log('✅ Generated smart response:', smartResponse.substring(0, 100));
      
      return smartResponse;
    }

    const trimmedMessage = String(aiMessage).trim();

    console.log('✅ N8N response parsed successfully:', {
      messageLength: trimmedMessage.length,
      duration: duration + 'ms',
      preview: trimmedMessage.substring(0, 100),
    });
    
    return trimmedMessage;
  } catch (error) {
    clearTimeout(timeout);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('The user aborted a request');
    
    console.error('❌ N8N Fetch Error:', {
      url: WEBHOOK_URL,
      error: errorMessage,
      isTimeout: isTimeout,
    });
    
    throw error;
  }
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, language = 'en' } = body;

    console.log('\n' + '='.repeat(60));
    console.log('📨 Chat request received');
    console.log('Message:', message.substring(0, 100));
    console.log('Language:', language);
    console.log('N8N Webhook URL:', WEBHOOK_URL ? '✅ Configured' : '❌ Not configured');
    console.log('='.repeat(60));

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Check if webhook is configured
    if (!WEBHOOK_URL) {
      const errorMsg = 'N8N webhook not configured. Please set NEXT_PUBLIC_AI_WEBHOOK_URL in .env.local';
      console.error('❌ Configuration error:', errorMsg);
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 503 }
      );
    }

    let aiMessage: string = '';
    const usedService = 'n8n-webhook';

    // Call n8n webhook (primary and only service)
    try {
      console.log('\n🔗 Calling N8N webhook...');
      aiMessage = await fetchWebhookResponse(message, language);
      console.log('✅ N8N webhook SUCCESS');
    } catch (webhookError) {
      const errorMsg = webhookError instanceof Error ? webhookError.message : String(webhookError);
      console.error(`❌ N8N webhook FAILED: ${errorMsg}`);
      console.error('Webhook URL being used:', WEBHOOK_URL);
      throw new Error(`N8N webhook failed: ${errorMsg}`);
    }

    // Response validation - should always have content since fetchWebhookResponse returns string
    if (!aiMessage || !aiMessage.trim()) {
      console.error('❌ No message content in webhook response');
      throw new Error('Webhook returned empty response');
    }

    const responseMessage = aiMessage.trim();
    console.log('✅ Chat response ready:', {
      messageLength: responseMessage.length,
      service: usedService,
      language: language,
      preview: responseMessage.substring(0, 100),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          message: responseMessage,
          tokens: responseMessage.length,
          language: language,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('\n' + '❌'.repeat(30));
    console.error('Chat route error:', error);
    console.error('❌'.repeat(30) + '\n');

    const isBadRequest =
      error instanceof Error && error.message === 'Invalid message format';

    const errorMessage = isBadRequest
      ? error instanceof Error
        ? error.message
        : 'Invalid request'
      : error instanceof Error
      ? error.message
      : 'AI service is currently unavailable';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      },
      { status: isBadRequest ? 400 : 503 }
    );
  }
}


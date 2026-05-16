const ALL_QUESTIONS = {
  Technology: [
    {q:"What does HTML stand for?", opts:["HyperText Markup Language","High Tech Modern Language","Hyper Transfer Markup Logic","Home Tool Markup Language"], a:0},
    {q:"Which language is primarily used to style web pages?", opts:["Python","Java","CSS","SQL"], a:2},
    {q:"What does CPU stand for?", opts:["Central Processing Unit","Computer Personal Unit","Core Program Utility","Central Program Uplink"], a:0},
    {q:"What does 'AI' stand for?", opts:["Automated Interface","Artificial Intelligence","Advanced Integration","Automated Internet"], a:1},
    {q:"Which of these is a programming language?", opts:["HTTP","HTML","Python","DNS"], a:2},
    {q:"What does 'URL' stand for?", opts:["Universal Resource Locator","Uniform Resource Locator","Unified Remote Link","Universal Remote Language"], a:1},
    {q:"What does RAM stand for?", opts:["Random Access Memory","Read Access Module","Rapid Array Memory","Remote Application Manager"], a:0},
    {q:"Which symbol starts a comment in Python?", opts:["//","--","#","/*"], a:2},
  ],
  Cybersecurity: [
    {q:"What is phishing?", opts:["A fishing sport","A cyberattack using deceptive messages to steal info","A type of malware virus","A network monitoring tool"], a:1},
    {q:"What does 'VPN' stand for?", opts:["Virtual Private Network","Very Protected Node","Visual Processing Network","Verified Private Node"], a:0},
    {q:"Which is the strongest password?", opts:["password123","MyName2000","T!g#9kL@2mZ","12345678"], a:2},
    {q:"What is two-factor authentication (2FA)?", opts:["Using two passwords","A login requiring two forms of verification","Two users sharing an account","Encrypting data twice"], a:1},
    {q:"What is ransomware?", opts:["Software that speeds up your PC","Malware that encrypts your files and demands payment","A type of antivirus","A browser extension"], a:1},
    {q:"What does HTTPS stand for?", opts:["High Transfer Protocol Secure","HyperText Transfer Protocol Secure","Hosted Transfer Private System","Hyper Transfer Privacy Standard"], a:1},
    {q:"What is a firewall?", opts:["A physical barrier in buildings","A system that monitors and controls network traffic","A type of virus","A password manager"], a:1},
  ],
  "General Knowledge": [
    {q:"What is the capital of Ethiopia?", opts:["Nairobi","Addis Ababa","Kampala","Khartoum"], a:1},
    {q:"How many continents are there on Earth?", opts:["5","6","7","8"], a:2},
    {q:"What is H₂O commonly known as?", opts:["Oxygen","Hydrogen","Water","Salt"], a:2},
    {q:"What is the largest planet in our solar system?", opts:["Saturn","Neptune","Earth","Jupiter"], a:3},
    {q:"Who is credited with inventing the telephone?", opts:["Thomas Edison","Nikola Tesla","Alexander Graham Bell","Albert Einstein"], a:2},
    {q:"How many sides does a hexagon have?", opts:["5","6","7","8"], a:1},
    {q:"What is the fastest land animal?", opts:["Lion","Cheetah","Horse","Leopard"], a:1},
  ]
};

let selectedCat = null;
let questions = [];
let currentIdx = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 20;
let answered = false;
const LETTERS = ['A','B','C','D'];

function selectCat(el, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedCat = cat;
  const btn = document.getElementById('start-btn');
  btn.disabled = false;
  btn.textContent = `Start "${cat}" Quiz →`;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  const pool = ALL_QUESTIONS[selectedCat] || [];
  questions = shuffle(pool).slice(0, 5);
  currentIdx = 0;
  score = 0;
  showScreen('quiz');
  renderQuestion();
}

function renderQuestion() {
  clearTimer();
  answered = false;
  document.getElementById('next-btn').classList.remove('show');
  const fb = document.getElementById('feedback');
  fb.className = 'feedback';
  fb.textContent = '';

  const q = questions[currentIdx];
  document.getElementById('q-counter').textContent = `Question ${currentIdx + 1} of ${questions.length}`;
  document.getElementById('score-badge').textContent = `Score: ${score}`;
  document.getElementById('prog').style.width = (currentIdx / questions.length * 100) + '%';
  document.getElementById('q-text').textContent = q.q;

  const opts = document.getElementById('options');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="opt-letter">${LETTERS[i]}</span>${opt}`;
    btn.onclick = () => selectAnswer(i);
    opts.appendChild(btn);
  });

  startTimer();
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;
  clearTimer();

  const q = questions[currentIdx];
  const correct = q.a;
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);
  allBtns[correct].classList.add('correct');

  const fb = document.getElementById('feedback');
  if (idx === correct) {
    score++;
    allBtns[idx].classList.add('correct');
    fb.textContent = '✓ Correct! Great job.';
    fb.className = 'feedback show ok';
  } else {
    allBtns[idx].classList.add('wrong');
    fb.textContent = `✗ Wrong. The correct answer was ${LETTERS[correct]}.`;
    fb.className = 'feedback show bad';
  }

  document.getElementById('score-badge').textContent = `Score: ${score}`;
  document.getElementById('next-btn').classList.add('show');
}

function nextQuestion() {
  currentIdx++;
  if (currentIdx >= questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function startTimer() {
  timeLeft = 20;
  const el = document.getElementById('timer');
  el.className = 'timer';
  el.textContent = '20s';
  timerInterval = setInterval(() => {
    timeLeft--;
    el.textContent = timeLeft + 's';
    if (timeLeft <= 5) el.className = 'timer urgent';
    if (timeLeft <= 0) {
      clearTimer();
      if (!answered) {
        answered = true;
        document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        const q = questions[currentIdx];
        document.querySelectorAll('.option-btn')[q.a].classList.add('correct');
        const fb = document.getElementById('feedback');
        fb.textContent = "⏱ Time's up! Moving on...";
        fb.className = 'feedback show bad';
        document.getElementById('next-btn').classList.add('show');
      }
    }
  }, 1000);
}

function clearTimer() { clearInterval(timerInterval); }

function showResults() {
  clearTimer();
  showScreen('result');
  document.getElementById('final-num').textContent = score;
  const pct = score / questions.length;
  const msgs = [
    [1.0,  '🏆 Perfect Score!',   'Flawless. You nailed every question.'],
    [0.8,  '🎉 Excellent!',        'You really know your stuff, Faiz!'],
    [0.6,  '👍 Good Job!',         'Solid performance. Keep it up!'],
    [0.4,  '📚 Keep Studying!',    'You\'re getting there — practice makes perfect.'],
    [0.0,  '💪 Don\'t Give Up!',  'Every expert was once a beginner. Try again!'],
  ];
  const [, title, sub] = msgs.find(([t]) => pct >= t);
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-sub').textContent =
    sub + `\n\nYou scored ${score} out of ${questions.length} questions correctly in the "${selectedCat}" category.`;
  document.getElementById('prog').style.width = '100%';
}

function replaySame() { startQuiz(); }
function goHome() {
  selectedCat = null;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
  const btn = document.getElementById('start-btn');
  btn.disabled = true;
  btn.textContent = 'Select a category to begin →';
  showScreen('home');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

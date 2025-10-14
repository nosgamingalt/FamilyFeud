(() => {
  // ----- DATA -----
  const builtInQuestions = [
    // CELL (easy/medium/hard)
    { q: "Name an organelle found in plant cells but not animal cells", a: ["Chloroplast","Cell wall","Large central vacuole"], cat:"cell", diff:"easy" },
    { q: "Name the powerhouse of the cell", a: ["Mitochondria"], cat:"cell", diff:"easy" },
    { q: "What organelle makes proteins?", a: ["Ribosomes","Rough ER"], cat:"cell", diff:"easy" },
    { q: "Which organelle contains genetic material in eukaryotes?", a: ["Nucleus"], cat:"cell", diff:"easy" },
    { q: "What structure controls transport into and out of the cell?", a: ["Cell membrane","Plasma membrane"], cat:"cell", diff:"easy" },
    { q: "Which organelle modifies and packages proteins for export?", a:["Golgi apparatus","Golgi body"], cat:"cell", diff:"medium" },
    { q: "Where are lipids synthesized in the cell?", a:["Smooth endoplasmic reticulum","Smooth ER"], cat:"cell", diff:"medium" },
    { q: "What organelle contains digestive enzymes and breaks down waste?", a:["Lysosome"], cat:"cell", diff:"medium" },
    { q: "What are thylakoids and where are they found?", a:["Inside chloroplasts","Chloroplast"], cat:"cell", diff:"hard" },
    { q: "Name a structure unique to prokaryotic cells", a:["Nucleoid","Plasmids","Cell wall (in bacteria)"], cat:"cell", diff:"hard" },
    // GENETICS
    { q: "What is the basic unit of heredity?", a:["Gene"], cat:"genetics", diff:"easy" },
    { q: "What shape is DNA?", a:["Double helix"], cat:"genetics", diff:"easy" },
    { q: "Name the four DNA bases", a:["Adenine","Thymine","Cytosine","Guanine"], cat:"genetics", diff:"easy" },
    { q: "What is a mutation?", a:["Change in DNA sequence","Alteration in genetic code"], cat:"genetics", diff:"medium" },
    { q: "What process creates gametes with half the chromosome number?", a:["Meiosis"], cat:"genetics", diff:"medium" },
    { q: "What is phenotypic variation?", a:["Differences in observable traits","Trait variation"], cat:"genetics", diff:"hard" },
    { q: "Name an example of a polygenic trait", a:["Height","Skin color"], cat:"genetics", diff:"hard" },
    // ECOLOGY
    { q: "Name a level of ecological organization", a:["Organism","Population","Community","Ecosystem","Biosphere"], cat:"ecology", diff:"easy" },
    { q: "What process releases CO₂ into the atmosphere?", a:["Respiration","Decomposition","Combustion"], cat:"ecology", diff:"easy" },
    { q: "What is a producer in an ecosystem?", a:["Autotroph","Plant","Photosynthetic organism"], cat:"ecology", diff:"easy" },
    { q: "Name a biotic factor in an ecosystem", a:["Predators","Plants","Microbes"], cat:"ecology", diff:"medium" },
    { q: "What is carrying capacity?", a:["Maximum population environment can support"], cat:"ecology", diff:"medium" },
    { q: "Define ecological succession", a:["Change in species composition over time"], cat:"ecology", diff:"hard" },
    // HUMAN SYSTEMS
    { q: "Name a system in the human body", a:["Circulatory","Respiratory","Nervous","Digestive","Muscular"], cat:"systems", diff:"easy" },
    { q: "Which system transports oxygen and nutrients?", a:["Circulatory system","Cardiovascular"], cat:"systems", diff:"easy" },
    { q: "Where does gas exchange occur in the lungs?", a:["Alveoli"], cat:"systems", diff:"medium" },
    { q: "What structure filters blood in the urinary system?", a:["Kidney","Nephron"], cat:"systems", diff:"medium" },
    { q: "Name a hormone produced by the pancreas", a:["Insulin","Glucagon"], cat:"systems", diff:"hard" },
    // PHOTOSYNTHESIS
    { q: "What are the products of photosynthesis?", a:["Glucose","Oxygen"], cat:"photosynthesis", diff:"easy" },
    { q: "Where does photosynthesis occur?", a:["Chloroplast","Chloroplasts"], cat:"photosynthesis", diff:"easy" },
    { q: "What gas do plants take in for photosynthesis?", a:["Carbon dioxide","CO2"], cat:"photosynthesis", diff:"easy" },
    { q: "What pigment captures light in plants?", a:["Chlorophyll"], cat:"photosynthesis", diff:"medium" },
    { q: "What molecule provides electrons to the light reactions?", a:["Water"], cat:"photosynthesis", diff:"medium" },
    { q: "Which cycle fixes carbon in plants?", a:["Calvin cycle"], cat:"photosynthesis", diff:"hard" },
    // EXTRA / MIXED
    { q: "Name something all living things need to survive", a:["Water","Energy","Nutrients","Oxygen"], cat:"cell", diff:"easy" },
    { q: "Name an organelle involved with movement or shape", a:["Cytoskeleton","Microtubules","Microfilaments"], cat:"cell", diff:"medium" },
    { q: "Name a way bacteria exchange genetic material", a:["Conjugation","Transformation","Transduction"], cat:"genetics", diff:"hard" },
    { q: "What is the process of programmed cell death?", a:["Apoptosis"], cat:"cell", diff:"hard" },
    { q: "Name an abiotic factor that affects ecosystems", a:["Temperature","Water","Sunlight","Soil"], cat:"ecology", diff:"easy" },
    { q: "Name a macromolecule", a:["Carbohydrates","Proteins","Lipids","Nucleic acids"], cat:"cell", diff:"easy" }
  ];

  // Session-added questions
  const sessionQuestions = [];

  // ----- STATE -----
  let currentQuestion = null;
  let timer = null;
  let timeLeft = 20;
  let teacherMode = false;

  // Scores persisted
  let scoreA = parseInt(localStorage.getItem('bf_scoreA') || '0', 10);
  let scoreB = parseInt(localStorage.getItem('bf_scoreB') || '0', 10);

  // ----- DOM -----
  const el = id => document.getElementById(id);
  const categorySelect = el('categorySelect');
  const difficultySelect = el('difficultySelect');
  const timerInput = el('timerInput');
  const nextBtn = el('nextBtn');
  const revealAllBtn = el('revealAllBtn');
  const answersList = el('answersList');
  const questionText = el('questionText');
  const timerDisplay = el('timerDisplay');
  const teacherCheckbox = el('teacherMode');
  const addQBtn = el('addQuestionBtn');
  const clearSessionBtn = el('clearSessionBtn');

  const scoreAE = el('scoreA');
  const scoreBE = el('scoreB');
  const addPointA = el('addPointA');
  const subPointA = el('subPointA');
  const addPointB = el('addPointB');
  const subPointB = el('subPointB');
  const strikeBtn = el('strikeBtn');
  const resetBtn = el('resetBtn');

  const tQuestion = el('tQuestion');
  const tAnswers = el('tAnswers');
  const tCategory = el('tCategory');
  const tDifficulty = el('tDifficulty');

  const sCorrect = el('sCorrect');
  const sWrong = el('sWrong');
  const sBuzzer = el('sBuzzer');

  // ----- UTIL -----
  function playSound(node) {
    if (!node) return;
    node.currentTime = 0;
    node.play().catch(()=>{});
  }

  function persistScores() {
    localStorage.setItem('bf_scoreA', String(scoreA));
    localStorage.setItem('bf_scoreB', String(scoreB));
    scoreAE.textContent = scoreA;
    scoreBE.textContent = scoreB;
  }

  function buildPool() {
    const cat = categorySelect.value;
    const diff = difficultySelect.value;
    return [...builtInQuestions, ...sessionQuestions].filter(q => {
      if (cat !== 'all' && q.cat !== cat) return false;
      if (diff !== 'all' && q.diff !== diff) return false;
      return true;
    });
  }

  function pickQuestion() {
    const pool = buildPool();
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random()*pool.length)];
  }

  // ----- RENDER -----
  function renderQuestion(q) {
    stopTimer();
    currentQuestion = q;
    timeLeft = Number(timerInput.value) || 20;
    timerDisplay.textContent = `⏱️ ${timeLeft}`;
    questionText.textContent = q ? q.q : 'No question available for this filter';
    answersList.innerHTML = '';
    if (!q) return;

    q.a.forEach((ans, i) => {
      const div = document.createElement('div');
      div.className = 'answer';
      div.dataset.index = i;
      div.dataset.answer = ans;
      div.textContent = '???';
      div.addEventListener('click', () => revealAnswer(div, ans));
      answersList.appendChild(div);
    });

    startTimer();

    if (teacherMode) autoReveal(300);
  }

  function revealAnswer(div, ans) {
    if (!div || div.classList.contains('revealed')) return;
    div.textContent = ans;
    div.classList.add('revealed');
    playSound(sCorrect);
  }

  function revealAll() {
    [...answersList.children].forEach((div) => {
      if (!div.classList.contains('revealed')) {
        revealAnswer(div, div.dataset.answer);
      }
    });
  }

  function autoReveal(delayBetween = 700) {
    const divs = [...answersList.children];
    divs.forEach((div, idx) => {
      setTimeout(()=> {
        revealAnswer(div, div.dataset.answer);
      }, delayBetween * idx);
    });
  }

  // ----- TIMER -----
  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `⏱️ ${timeLeft}`;
      if (timeLeft <= 0) {
        stopTimer();
        timerDisplay.textContent = `⏱️ Time's up!`;
        playSound(sBuzzer);

        // Reveal all answers
        revealAll();

        // Auto-advance if NOT in teacher mode
        if (!teacherMode) {
          setTimeout(() => {
            const q = pickQuestion();
            renderQuestion(q);
          }, 2000); // 2 second delay for students to read
        }
      }
    }, 1000);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // ----- EVENTS -----
  nextBtn.addEventListener('click', ()=> {
    const q = pickQuestion();
    renderQuestion(q);
  });

  revealAllBtn.addEventListener('click', ()=> revealAll());

  teacherCheckbox.addEventListener('change', (e) => {
    teacherMode = e.target.checked;
    if (teacherMode && currentQuestion) autoReveal(400);
  });

  addPointA.addEventListener('click', ()=> { scoreA += 10; persistScores(); });
  subPointA.addEventListener('click', ()=> { scoreA -= 5; if(scoreA<0)scoreA=0; persistScores(); });
  addPointB.addEventListener('click', ()=> { scoreB += 10; persistScores(); });
  subPointB.addEventListener('click', ()=> { scoreB -= 5; if(scoreB<0)scoreB=0; persistScores(); });

  strikeBtn.addEventListener('click', ()=> { playSound(sWrong); });

  resetBtn.addEventListener('click', ()=> {
    if (!confirm('Reset both team scores to zero?')) return;
    scoreA = 0; scoreB = 0; persistScores();
  });

  addQBtn.addEventListener('click', ()=> {
    const qtxt = tQuestion.value.trim();
    const atxt = tAnswers.value.trim();
    const cat = tCategory.value;
    const diff = tDifficulty.value;
    if (!qtxt || !atxt) { alert('Please provide both question text and comma-separated answers.'); return; }
    const answers = atxt.split(',').map(s=>s.trim()).filter(Boolean);
    if (answers.length === 0) { alert('Add at least one answer.'); return; }
    sessionQuestions.push({ q: qtxt, a: answers, cat, diff });
    tQuestion.value=''; tAnswers.value='';
    alert('Question added for this session. It will appear in the pool immediately.');
  });

  clearSessionBtn.addEventListener('click', ()=> {
    if (!confirm('Clear all session-added questions?')) return;
    sessionQuestions.length = 0;
    alert('Session-added questions cleared.');
  });

  [categorySelect, difficultySelect].forEach(sel => {
    sel.addEventListener('change', ()=> {
      const pool = buildPool();
      if (currentQuestion && !pool.includes(currentQuestion)) {
        questionText.textContent = 'Press Next Question to get a question matching filters';
        answersList.innerHTML = '';
        stopTimer();
      }
    });
  });

  [tQuestion, tAnswers].forEach(inp => inp.addEventListener('keyup', (e)=>{ if (e.key==='Enter') addQBtn.click(); }));

  persistScores();

  window._bf = { builtInQuestions, sessionQuestions, pickQuestion, renderQuestion, revealAll };

})();

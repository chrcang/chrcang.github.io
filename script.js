document.addEventListener('DOMContentLoaded', () => {
    const subjectsList = document.getElementById('subjects-list');
    const quizSection = document.getElementById('quiz-section');
    const questionTitle = document.getElementById('question-title');
    const optionsDiv = document.getElementById('options');
    const fillAnswer = document.getElementById('fill-answer');
    const submitAnswer = document.getElementById('submit-answer');
    const nextQuestion = document.getElementById('next-question');
    const feedbackDiv = document.getElementById('feedback');
    const scoreSection = document.getElementById('score-section');
    const scoreDisplay = document.getElementById('score');
    const restartButton = document.getElementById('restart');
    const extraFeedback = document.getElementById('extra-feedback');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentQuestion = null;
    let selectedOption = null;

    // 模拟题库数据，可以在此处添加更多题库和题目
    const subjects = [
        { name: 'MySQL', file: 'MySQL.json' },
        { name: 'JavaScript', file: 'JavaScript.json' },
        { name: 'Java', file: 'java.json' }
    ];

    function loadSubjects() {
        subjects.forEach(subject => {
            const li = document.createElement('li');
            li.textContent = subject.name;
            li.addEventListener('click', () => selectSubject(subject.file));
            subjectsList.appendChild(li);
        });
    }

    function selectSubject(subjectFile) {
        fetch(`subjects/${subjectFile}`)
            .then(response => response.json())
            .then(data => {
                questions = data;
                shuffle(questions);
                currentQuestionIndex = 0;
                score = 0;
                document.getElementById('subject-selection').style.display = 'none';
                quizSection.style.display = 'block';
                showQuestion();
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showQuestion() {
        currentQuestion = questions[currentQuestionIndex];
        questionTitle.textContent = currentQuestion.question;
        feedbackDiv.textContent = '';
        selectedOption = null;

        if (currentQuestion.type === 'multiple-choice') {
            fillAnswer.style.display = 'none';
            optionsDiv.style.display = 'block';
            optionsDiv.innerHTML = '';
            const options = [...currentQuestion.options];
            shuffle(options);
            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.addEventListener('click', () => selectOption(button));
                optionsDiv.appendChild(button);
            });
        } else if (currentQuestion.type === 'fill-in-the-blank') {
            optionsDiv.style.display = 'none';
            fillAnswer.style.display = 'block';
            fillAnswer.value = '';
        }
    }

    function selectOption(button) {
        if (selectedOption) {
            selectedOption.classList.remove('selected');
        }
        button.classList.add('selected');
        selectedOption = button;
    }

    function checkAnswer() {
        if (!selectedOption && currentQuestion.type === 'multiple-choice') {
            feedbackDiv.textContent = '请选择一个选项！';
            return;
        }

        const answer = currentQuestion.type === 'multiple-choice' ? selectedOption.textContent : fillAnswer.value;
        let correct = false;

        if (currentQuestion.type === 'multiple-choice') {
            correct = answer === currentQuestion.answer;
            if (correct) {
                selectedOption.classList.add('correct');
            } else {
                selectedOption.classList.add('incorrect');
                feedbackDiv.textContent = `不对！正确答案是: ${currentQuestion.answer}`;
            }
        } else if (currentQuestion.type === 'fill-in-the-blank') {
            correct = currentQuestion.answers.includes(answer);
            if (correct) {
                feedbackDiv.textContent = '正确!';
            } else {
                feedbackDiv.textContent = `不对！正确答案是: ${currentQuestion.answers.join(' 或 ')}`;
            }
        }

        if (correct) {
            feedbackDiv.textContent = '正确!';
            score++;
        }

        submitAnswer.style.display = 'none';
        nextQuestion.style.display = 'inline';
    }

    function nextQuestionHandler() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
        submitAnswer.style.display = 'inline';
        nextQuestion.style.display = 'none';
    }

    function showScore() {
        quizSection.style.display = 'none';
        scoreSection.style.display = 'block';
        const correctRate = (score / questions.length) * 100;
        scoreDisplay.textContent = `你的正确率是: ${score} / ${questions.length}`;

        if (correctRate > 70) {
            extraFeedback.textContent = '不是 哥们 你真会啊 !';
        } else {
            extraFeedback.textContent = '牢弟 还得练 ！';
        }
    }

    restartButton.addEventListener('click', () => {
        scoreSection.style.display = 'none';
        document.getElementById('subject-selection').style.display = 'block';
        subjectsList.innerHTML = '';
        extraFeedback.textContent = '';
        loadSubjects();
    });

    submitAnswer.addEventListener('click', checkAnswer);
    nextQuestion.addEventListener('click', nextQuestionHandler);

    loadSubjects();
});

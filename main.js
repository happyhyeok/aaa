// Teachable Machine URL
const TM_URL = "https://teachablemachine.withgoogle.com/models/2Zh9DNII6/";

let model, labelContainer, maxPredictions;

// Load the image model
async function initTM() {
    const modelURL = TM_URL + "model.json";
    const metadataURL = TM_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Image upload and preview
function readURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('face-image');
            img.src = e.target.result;
            img.style.display = 'block';
            document.getElementById('upload-label').style.display = 'none';
            predict();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Prediction logic
async function predict() {
    if (!model) await initTM();
    
    const loading = document.getElementById('loading');
    const resultMsg = document.getElementById('result-message');
    const labelContainer = document.getElementById('label-container');
    
    loading.style.display = 'block';
    resultMsg.innerHTML = '';
    labelContainer.innerHTML = '';

    const image = document.getElementById('face-image');
    const prediction = await model.predict(image, false);
    
    loading.style.display = 'none';
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));

    const topResult = prediction[0].className;
    let emoji = topResult === '강아지' ? '🐶' : '🐱';
    resultMsg.innerHTML = `${emoji} 당신은 ${topResult}상입니다!`;

    for (let i = 0; i < maxPredictions; i++) {
        const prob = (prediction[i].probability * 100).toFixed(0);
        const classTitle = prediction[i].className;
        const barContainer = document.createElement('div');
        barContainer.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <span style="width: 60px; text-align: left;">${classTitle}</span>
                <div style="flex-grow: 1; background: var(--row-bg); height: 10px; border-radius: 5px; margin: 0 10px;">
                    <div style="background: var(--accent-color); width: ${prob}%; height: 100%; border-radius: 5px;"></div>
                </div>
                <span style="width: 35px;">${prob}%</span>
            </div>
        `;
        labelContainer.appendChild(barContainer);
    }
}

// Lotto Logic
function generateFiveGames() {
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = '';
    const labels = ['A', 'B', 'C', 'D', 'E'];

    labels.forEach((label, index) => {
        const numbers = getLottoNumbers();
        const rowDiv = document.createElement('div');
        rowDiv.className = 'lotto-row';
        rowDiv.style.animationDelay = `${index * 0.1}s`;

        const labelSpan = document.createElement('span');
        labelSpan.className = 'row-label';
        labelSpan.innerText = label;

        const ballsDiv = document.createElement('div');
        ballsDiv.className = 'numbers-group';

        numbers.forEach(num => {
            const ball = document.createElement('div');
            ball.className = `ball ${getColorClass(num)}`;
            ball.innerText = num;
            ballsDiv.appendChild(ball);
        });

        rowDiv.appendChild(labelSpan);
        rowDiv.appendChild(ballsDiv);
        resultArea.appendChild(rowDiv);
    });
}

function getLottoNumbers() {
    const numbers = new Set();
    while(numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function getColorClass(num) {
    if (num <= 10) return 'yellow';
    if (num <= 20) return 'blue';
    if (num <= 30) return 'red';
    if (num <= 40) return 'gray';
    return 'green';
}

// Theme Toggle Logic
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle-btn');
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        themeBtn.innerText = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-mode');
        themeBtn.innerText = '☀️';
        localStorage.setItem('theme', 'dark');
    }

    if (typeof DISQUS !== 'undefined') {
        DISQUS.reset({ reload: true });
    }
}

// Initialize
window.onload = () => {
    initTM(); // Load model in background
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle-btn');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeBtn.innerText = '☀️';
    } else {
        themeBtn.innerText = '🌙';
    }
};

function generateFiveGames() {
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = ''; // 기존 결과 초기화
    
    const labels = ['A', 'B', 'C', 'D', 'E']; // 각 줄 라벨

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

    // Reload Disqus if it exists to pick up the new theme color
    if (typeof DISQUS !== 'undefined') {
        DISQUS.reset({
            reload: true,
            config: function () {
                this.page.identifier = window.location.pathname;
                this.page.url = window.location.href;
            }
        });
    }
}

// Initialize Theme
window.onload = () => {
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

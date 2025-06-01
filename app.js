document.addEventListener('DOMContentLoaded', () => {
    setupTypeButtons();
    setupPlanCards();
    updateUI();
});

function setupTypeButtons() {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedProblemType = btn.dataset.type;
        });
    });
}

function setupPlanCards() {
    document.querySelectorAll('.subscription-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.subscription-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

function updateUI() {
    const limitation = document.getElementById('limitationMessage');
    if (currentPlan === 'free') {
        limitation.style.display = 'block';
        document.getElementById('remainingUses').textContent = dailyUses;
    } else {
        limitation.style.display = 'none';
    }
}

async function solveProblem() {
    const input = document.getElementById('mathProblem').value.trim();
    const resultSection = document.getElementById('resultSection');
    const solution = document.getElementById('solution');
    const stepsList = document.getElementById('stepsList');

    if (!input) return alert('Por favor escribe un problema.');

    if (currentPlan === 'free' && dailyUses <= 0) {
        return alert('Límite diario alcanzado.');
    }

    solution.innerHTML = '⏳ Procesando...';
    stepsList.innerHTML = '';
    resultSection.style.display = 'block';

    await delay(1000);

    try {
        const result = await solveMathProblem(input);
        solution.innerHTML = result.solution;
        document.getElementById('steps').style.display = result.steps ? 'block' : 'none';

        if (result.steps) {
            stepsList.innerHTML = result.steps.map((step, i) =>
                `<div class="step"><strong>Paso ${i + 1}:</strong> ${step}</div>`
            ).join('');
        }

        if (currentPlan === 'free') {
            dailyUses--;
            updateUI();
        }

    } catch (err) {
        solution.innerHTML = `<div style="color: red;">❌ Error: ${err.message}</div>`;
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

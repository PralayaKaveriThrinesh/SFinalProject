document.addEventListener('DOMContentLoaded', () => {
    const scoreElement = document.getElementById('safety-score');
    const statusText = document.getElementById('status-text');
    const statusBadge = document.getElementById('status-badge');
    const progressCircle = document.querySelector('.meter-progress');
    
    const totalElement = document.getElementById('stat-total');
    const maskElement = document.getElementById('stat-mask');
    const noMaskElement = document.getElementById('stat-no-mask');
    const uptimeElement = document.getElementById('uptime-val');
    const timestampElement = document.getElementById('current-time');

    // Circle circumference (2 * PI * r) where r=70 (matching SVG)
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = circumference;

    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        
        // Update color and text based on score
        if (percent >= 90) {
            progressCircle.style.stroke = 'var(--success)';
            statusBadge.style.color = 'var(--success)';
            statusBadge.classList.add('status-safe');
            statusBadge.classList.remove('status-caution', 'status-danger');
            statusText.innerText = 'SAFE ZONE - Excellent';
        } else if (percent >= 70) {
            progressCircle.style.stroke = 'var(--warning)';
            statusBadge.style.color = 'var(--warning)';
            statusBadge.classList.add('status-caution');
            statusBadge.classList.remove('status-safe', 'status-danger');
            statusText.innerText = 'CAUTION - Moderate Risk';
        } else {
            progressCircle.style.stroke = 'var(--danger)';
            statusBadge.style.color = 'var(--danger)';
            statusBadge.classList.add('status-danger');
            statusBadge.classList.remove('status-safe', 'status-caution');
            statusText.innerText = 'DANGER - Please Wear Mask!';
        }
    }

    function updateStats() {
        fetch('/stats')
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then(data => {
                // Update stats
                animateValue('stat-total', parseInt(totalElement.innerText) || 0, data.total_people, 400);
                animateValue('stat-mask', parseInt(maskElement.innerText) || 0, data.with_mask, 400);
                animateValue('stat-no-mask', parseInt(noMaskElement.innerText) || 0, data.without_mask, 400);

                uptimeElement.innerText = data.uptime || '00:00:00';

                let score = data.safety_score || 0;
                scoreElement.innerText = score + '%';
                setProgress(score);

                // --- Dynamic Alert Banner ---
                const alertBanner = document.getElementById('alert-banner');
                const alertText = document.getElementById('alert-text');
                if (data.alert_message && data.alert_message !== '') {
                    alertText.innerText = data.alert_message;
                    alertBanner.style.display = 'flex';
                } else {
                    alertBanner.style.display = 'none';
                }
            })
            .catch(err => {
                console.error('Failed to fetch stats:', err);
                statusText.innerText = 'Offline';
                statusBadge.classList.add('status-danger');
            });
    }

    // Number animation function
    function animateValue(id, start, end, duration) {
        if (start === end) return;
        const obj = document.getElementById(id);
        const range = end - start;
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        
        const timer = setInterval(() => {
            current += increment;
            obj.innerHTML = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime || 1);
    }

    // Clock update
    function updateClock() {
        const now = new Date();
        timestampElement.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    // Initialize
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(updateStats, 1000); // 1-second interval as requested
    updateStats(); // Initial call
});

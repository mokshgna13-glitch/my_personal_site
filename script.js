document.addEventListener("DOMContentLoaded", () => {
    const spaceCanvas = document.getElementById('space-bg');
    const spaceCtx = spaceCanvas.getContext('2d');
    const revealCanvas = document.getElementById('reveal-canvas');
    const revealCtx = revealCanvas.getContext('2d');

    let stars = [];
    let revealTrail = [];
    const maxTrailAge = 35;
    const brushRadius = 75;

    function syncCanvasSizes() {
        if (spaceCanvas) {
            spaceCanvas.width = window.innerWidth;
            spaceCanvas.height = window.innerHeight;
        }
        if (revealCanvas && revealCanvas.parentElement) {
            const container = revealCanvas.parentElement;
            revealCanvas.width = container.clientWidth;
            revealCanvas.height = container.clientHeight;
        }
    }

    // --- 1. Space Star Generator ---
    function initSpaceBackground() {
        stars = [];
        for (let i = 0; i < 40; i++) {
            stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 4 + 1.5,
                driftY: Math.random() * 0.35 + 0.15
            });
        }
    }

    // --- 2. Interactive Brush Tracker ---
    window.addEventListener('mousemove', (e) => {
        if (!revealCanvas) return;
        const rect = revealCanvas.getBoundingClientRect();
        revealTrail.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            age: 0
        });
    });

    // --- 3. Main Rendering Loop (Runs instantly) ---
    function processFrameUpdate() {
        // Space Floating Particles Pass
        if (spaceCanvas && spaceCtx) {
            spaceCtx.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);
            spaceCtx.fillStyle = '#006644';
            stars.forEach(s => {
                spaceCtx.beginPath();
                spaceCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                spaceCtx.fill();
                s.y += s.driftY;
                if (s.y > spaceCanvas.height) {
                    s.y = 0;
                    s.x = Math.random() * spaceCanvas.width;
                }
            });
        }

        // Hero Mask Reveal Text Pass
        if (revealCanvas && revealCtx) {
            revealCtx.clearRect(0, 0, revealCanvas.width, revealCanvas.height);
            revealCtx.fillStyle = '#ffffaa'; 
            revealCtx.fillRect(0, 0, revealCanvas.width, revealCanvas.height);

            revealCtx.font = "900 8.5vw Impact";
            revealCtx.fillStyle = "#003322"; 
            revealCtx.textAlign = "center";
            revealCtx.textBaseline = "middle";
            revealCtx.fillText("M O K S H G N A", revealCanvas.width / 2, revealCanvas.height / 2);

            revealCtx.save();
            revealCtx.globalCompositeOperation = 'destination-out';

            for (let i = 0; i < revealTrail.length; i++) {
                const pt = revealTrail[i];
                const opacity = 1 - (pt.age / maxTrailAge);
                
                const grad = revealCtx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, brushRadius);
                grad.addColorStop(0, `rgba(0,0,0,${opacity})`);
                grad.addColorStop(0.6, `rgba(0,0,0,${opacity * 0.4})`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');

                revealCtx.fillStyle = grad;
                revealCtx.beginPath();
                revealCtx.arc(pt.x, pt.y, brushRadius, 0, Math.PI * 2);
                revealCtx.fill();
                pt.age++;
            }
            revealCtx.restore();
            revealTrail = revealTrail.filter(pt => pt.age < maxTrailAge);
        }

        requestAnimationFrame(processFrameUpdate);
    }

    // --- 4. Project Card 3D Tilt Engine ---
    document.querySelectorAll(".tilt-card").forEach((card) => {
        const content = card.querySelector(".project-content");
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            const rotX = (y / (rect.height / 2)) * -10;
            const rotY = (x / (rect.width / 2)) * 10;
            content.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
        });
        card.addEventListener("mouseleave", () => {
            content.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });

    window.addEventListener('resize', () => {
        syncCanvasSizes();
        initSpaceBackground();
    });

    // Initialize layout setup immediately on load
    syncCanvasSizes();
    initSpaceBackground();
    processFrameUpdate();
});

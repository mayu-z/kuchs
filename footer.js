 gsap.registerPlugin(ScrollTrigger);

        const cards = document.querySelectorAll('.card');
        const titles = document.querySelectorAll('.title');
        const progressBar = document.querySelector('.progress-bar');

        const initialRotations = [0, -8, 12, -15, 18, -20];

        // Set initial rotations and state
        cards.forEach((card, i) => {
            gsap.set(card, {
                rotation: initialRotations[i],
                x: 0,
                opacity: 1,
                transformOrigin: "center center"
            });
        });

        gsap.set(titles, {
            fontSize: "20px",
            color: "#888"
        });
        gsap.set(titles[0], {
            fontSize: "40px",
            color: "#fff"
        });

        // Use a single ScrollTrigger with faster scroll speed
        ScrollTrigger.create({
            trigger: ".container",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.1, // Made faster (was 0.3)
            onUpdate: (self) => {
                const total = cards.length;
                const progress = self.progress;
                const activeIndex = Math.min(Math.floor(progress * total), total - 1);

                cards.forEach((card, i) => {
                    if (i < activeIndex) {
                        // Animate left off-screen
                        gsap.to(card, { 
                            x: -500, 
                            opacity: 0, 
                            rotation: initialRotations[i], 
                            duration: 0.3, // Made faster (was 0.5)
                            ease: "power2.out", 
                            overwrite: true 
                        });
                    } else {
                        // Bring back in stack
                        const newRotation = (i === activeIndex) ? 0 : initialRotations[i];
                        gsap.to(card, { 
                            x: 0, 
                            opacity: 1, 
                            rotation: newRotation, 
                            duration: 0.3, // Made faster (was 0.5)
                            ease: "power2.out", 
                            overwrite: true 
                        });
                    }
                });

                // Update titles: only active big
                titles.forEach((title, i) => {
                    if (i === activeIndex) {
                        gsap.to(title, {
                            fontSize: "40px",
                            color: "#fff",
                            filter: "blur(0px)",
                            duration: 0.3, // Made faster (was 0.5)
                            overwrite: true
                        });
                    } else {
                        gsap.to(title, {
                            fontSize: "20px",
                            color: "#888",
                            filter: "blur(2px)",
                            duration: 0.3, // Made faster (was 0.5)
                            overwrite: true
                        });
                    }
                });

                // Progress bar
                progressBar.style.height = `${progress * 100}%`;
            }
        });

        // Hover effect for front card
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const rect = card.getBoundingClientRect();
                if (rect.left > -100) {
                    gsap.to(card, { scale: 1.02, duration: 0.3, ease: "power2.out" });
                }
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
            });
        });

        // Refresh on resize
        window.addEventListener('resize', () => ScrollTrigger.refresh());
        gsap.ticker.fps(60);
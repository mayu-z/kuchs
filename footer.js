 gsap.registerPlugin(ScrollTrigger);

        const cards = document.querySelectorAll('.card');
        const titles = document.querySelectorAll('.title');
        const progressBar = document.querySelector('.progress-bar');
        
        // Initial setup
        const initialRotations = [0, -8, 12, -15, 18, -20];
        
        gsap.set(cards, { 
            transformOrigin: "center center",
            rotation: (i) => initialRotations[i],
            x: 0,
            opacity: 1
        });

        // Set initial title states - first one is large
        gsap.set(titles, {
            fontSize: "1.5rem",
            color: "#888"
        });
        gsap.set(titles[0], {
            fontSize: "3rem",
            color: "#fff"
        });

        // Create individual timelines for each card transition
        cards.forEach((card, index) => {
            // Calculate scroll positions for each card
            const startPercent = (index / cards.length) * 100;
            const endPercent = ((index + 1) / cards.length) * 100;
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".container",
                    start: `${startPercent}% top`,
                    end: `${endPercent}% top`,
                    scrub: 1.5,
                    onUpdate: self => {
                        // Update progress bar
                        const overallProgress = (index + self.progress) / cards.length;
                        progressBar.style.height = `${overallProgress * 100}%`;
                    }
                }
            });

            // Phase 1: Current card moves left AND its title shrinks (SIMULTANEOUS)
            tl.to(card, {
                x: -500,
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut"
            }, 0)
            .to(titles[index], {
                fontSize: "1.2rem",
                color: "#555",
                duration: 0.6,
                ease: "power2.inOut"
            }, 0); // Same timing as card movement

            // Phase 2: If there's a next card, rotate it and grow its title (SIMULTANEOUS)
            if (index < cards.length - 1) {
                tl.to(cards[index + 1], {
                    rotation: 0,
                    duration: 0.4,
                    ease: "power2.inOut"
                }, 0.4) // Starts while current card is still moving
                .to(titles[index + 1], {
                    fontSize: "3rem",
                    color: "#fff",
                    duration: 0.4,
                    ease: "power2.inOut"
                }, 0.4); // Same timing as card rotation
            }
        });

        // Add hover effects
        cards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                // Only add hover effect if card is still visible
                const cardRect = card.getBoundingClientRect();
                if (cardRect.left > -100) { // Card is still visible
                    gsap.to(card, {
                        scale: 1.02,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });

        // Optimize performance
        gsap.ticker.fps(60);
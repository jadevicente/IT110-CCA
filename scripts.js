document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".converter-form");
    const amountInput = document.getElementById("amount");
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    const resultCard = document.getElementById("resultCard");
    const resultAmount = document.getElementById("resultAmount");
    const resultText = document.getElementById("resultText");
    const loading = document.querySelector(".loading");

    // Hide result and loading sections initially
    resultCard.style.display = "none";
    loading.style.display = "none";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (!amount || !from || !to) {
            alert("Please fill in all fields.");
            return;
        }

        if (from === to) {
            alert("Please select different currencies for conversion.");
            return;
        }

        // Check internet connectivity
        if (!navigator.onLine) {
            alert("No internet connection. Please check your internet connection and try again.");
            return;
        }

        // Show loading spinner
        loading.style.display = "block";
        resultCard.style.display = "none";

        try {
            // Fetch exchange rates using Open Exchange Rate API
            const url = `https://open.er-api.com/v6/latest/${from}`;
            const response = await fetch(url);
            
            // Check if the response is ok (status 200-299)
            if (!response.ok) {
                throw new Error("No internet connection. Please check your internet connection and try again.");
            }
            
            const data = await response.json();
            console.log("API Data:", data);

            if (data.result !== "success") {
                throw new Error("Failed to fetch exchange rates.");
            }

            const rate = data.rates[to];
            if (!rate) {
                throw new Error(`Currency rate for ${to} not found.`);
            }

            const convertedAmount = (amount * rate).toFixed(2);

            // Hide loading spinner and show result
            loading.style.display = "none";
            resultCard.style.display = "block";
            resultCard.classList.add("show");
            resultAmount.textContent = `${convertedAmount} ${to}`;
            resultText.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
            
            // Show rate update date in Philippine time
            const rateInfo = document.getElementById("rateInfo");
            const rateDate = document.getElementById("rateDate");
            const updateTime = new Date(data.time_last_update_unix * 1000);
            const philippineTime = updateTime.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
            rateDate.textContent = philippineTime;
            rateInfo.style.display = "block";

        } catch (error) {
            loading.style.display = "none";
            // Check if it's a network error
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                alert("No internet connection. Please check your internet connection and try again.");
            } else {
                alert("Error: " + error.message);
            }
        }
    });
});

    $(document).ready(function() {
                $('#fromCurrency, #toCurrency').select2({
                    placeholder: "Search or select currency",
                    allowClear: true,
                    width: '100%',
                    minimumInputLength: 0,
                    language: {
                        noResults: function() {
                            return "No currencies found";
                        },
                        searching: function() {
                            return "Searching...";
                        }
                    }
                });
            });  

        // Navigation functionality
        const navLinks = document.querySelectorAll('.nav-links li a');
        const sections = document.querySelectorAll('section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                // Update active nav link
                navLinks.forEach(nl => nl.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll to target section
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        });

            // Add smooth animations for team cards
        const teamCards = document.querySelectorAll('.team-card');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, observerOptions);

        teamCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });

        //to update year automatically
        document.getElementById("year").textContent = new Date().getFullYear();
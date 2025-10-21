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

        // Show loading spinner
        loading.style.display = "block";
        resultCard.style.display = "none";

        try {
            // Fetch exchange rates using Open Exchange Rate API
            const url = `https://open.er-api.com/v6/latest/${from}`;
            const response = await fetch(url);
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
                timeZone: "Asia/Manila",
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
            alert("Error: " + error.message);
        }
    });
});

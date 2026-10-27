const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {

    // Stop browser from refreshing the page
    event.preventDefault();


    // Get values from inputs
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    // Send data to backend
    const response = await fetch("/api/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })

    });


    // Convert response to JavaScript object
    const data = await response.json();


    // Show message
    document.getElementById("message").textContent = data.message;

});
document.addEventListener('DOMContentLoaded', () => {
  // Handle appointment form submission
  const appointmentForm = document.getElementById("appointmentForm");
  const loginForm = document.getElementById("loginForm");

  // Book appointment if form exists
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", bookAppointment);
  }

  // Login form submission handling
  if (loginForm) {
    loginForm.addEventListener("submit", login);
  }

  // Login function
  async function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validate form fields
    if (!username || !password) {
      alert("❌ Please fill in both fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token in localStorage
        localStorage.setItem("token", data.token);
        alert("✅ Login successful!");
        window.location.href = "index.html";  // Redirect to the appointment booking page
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  }

  // Book an appointment function
  async function bookAppointment(event) {
    event.preventDefault();  // Prevent form from submitting traditionally

    const token = localStorage.getItem("token");  // Get the JWT token
    if (!token) {
      alert("❌ Please log in first!");
      window.location.href = "login.html";  // Redirect to the login page if no token
      return;
    }

    const service = document.getElementById("service").value;  // Get selected service
    const appointmentDate = document.getElementById("appointmentDate").value;  // Get selected date

    // Validate form fields
    if (!appointmentDate) {
      alert("❌ Please select a valid appointment date and time.");
      return;
    }

    const requestBody = {
      service: service,
      appointment_date: appointmentDate
    };

    try {
      const response = await fetch("http://localhost:3000/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // Include JWT token for authentication
        },
        body: JSON.stringify(requestBody)  // Send the form data as JSON
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Appointment booked successfully!");
        // Optionally, refresh the list of upcoming appointments here
        fetchAppointments();  // Refresh the appointments list after booking
      } else {
        alert(`❌ ${data.message || "Error booking appointment"}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  }

  // Fetch upcoming appointments
  async function fetchAppointments() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Please log in first!");
      window.location.href = "login.html";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/appointments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // Include JWT token for authentication
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Clear the current list of appointments
        const appointmentsList = document.getElementById("appointmentsList");
        appointmentsList.innerHTML = "";

        // Display the fetched appointments
        data.forEach(appointment => {
          const listItem = document.createElement("li");
          listItem.textContent = `Service: ${appointment.service}, Date: ${appointment.appointment_date}, Status: ${appointment.status}`;
          appointmentsList.appendChild(listItem);
        });
      } else {
        alert(`❌ ${data.message || "Error fetching appointments"}`);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  }

  // Logout function
  function logout() {
    localStorage.removeItem("token");  // Remove token from localStorage
    alert("✅ Logged out successfully!");
    window.location.href = "login.html";  // Redirect to login page
  }

  // Automatically fetch and display appointments if on the correct page
  if (document.getElementById("appointmentsList")) {
    fetchAppointments();  // Fetch and display appointments on page load
  }
});


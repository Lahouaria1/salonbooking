document.addEventListener("DOMContentLoaded", function () {
  getAppointments(); // Fetch appointments on page load

  // Handle form submission to book a new appointment
  document.getElementById("appointmentForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh

    const userId = document.getElementById("userId").value;
    const service = document.getElementById("service").value;
    const appointmentDate = document.getElementById("appointmentDate").value;

    // Validate inputs
    if (!userId || !service || !appointmentDate) {
      alert("❌ Please fill in all fields.");
      return;
    }

    // Make the API request to create an appointment
    fetch("http://localhost:3000/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(userId), // Ensure it's a number
        service: service,
        appointment_date: appointmentDate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes("✅")) {
          alert("✅ Appointment booked successfully!");
          getAppointments(); // Refresh the list of appointments
          document.getElementById("appointmentForm").reset(); // Clear form
        } else {
          alert("❌ Failed to book appointment. See console for details.");
          console.error("API Response:", data);
        }
      })
      .catch((error) => {
        alert("❌ Error booking appointment.");
        console.error("Fetch Error:", error);
      });
  });

  // Fetch and display all appointments
  function getAppointments() {
    fetch("http://localhost:3000/appointments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const appointmentsList = document.getElementById("appointmentsList");
        appointmentsList.innerHTML = ""; // Clear the list first

        if (data.length === 0) {
          appointmentsList.innerHTML = "<li>No upcoming appointments.</li>";
          return;
        }

        data.forEach((appointment) => {
          const listItem = document.createElement("li");
          listItem.textContent = `📅 ${appointment.service} on ${new Date(appointment.appointment_date).toLocaleString()}`;
          appointmentsList.appendChild(listItem);
        });
      })
      .catch((error) => console.error("Error fetching appointments:", error));
  }
});

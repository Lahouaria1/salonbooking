// // Wait for the DOM to load
// document.addEventListener("DOMContentLoaded", function () {
//   const appointmentForm = document.getElementById("appointmentForm");

//   // Handle form submission
//   appointmentForm.addEventListener("submit", async function (event) {
//       event.preventDefault();

//       // Get form values
//       const userId = parseInt(document.getElementById("userId").value); // Convert to integer
//       const service = document.getElementById("service").value;
//       const appointmentDate = document.getElementById("appointmentDate").value;

//       // Validate input fields
//       if (!userId || !service || !appointmentDate) {
//           alert("❌ Please fill in all fields.");
//           return;
//       }

//       // Prepare data for the API request
//       const appointmentData = {
//           user_id: userId,
//           service: service,
//           appointment_date: appointmentDate,
//           status: "pending" // Default to "pending"
//       };

//       try {
//           // Send data to backend API
//           const response = await fetch("http://localhost:3000/appointments", {
//               method: "POST",
//               headers: {
//                   "Content-Type": "application/json"
//               },
//               body: JSON.stringify(appointmentData)
//           });

//           const result = await response.json();
//           console.log("API Response:", result); // Debugging line

//           if (response.ok) {
//               alert("✅ Appointment booked successfully!");
//               getAppointments(); // Refresh the list of appointments
//               appointmentForm.reset(); // Clear the form
//           } else {
//               alert(`❌ Error: ${result.message}`);
//           }
//       } catch (error) {
//           console.error("❌ Fetch Error:", error);
//           alert("❌ There was an issue booking the appointment.");
//       }
//   });

//   // Fetch and display appointments
//   function getAppointments() {
//       fetch("http://localhost:3000/appointments")
//           .then(response => response.json())
//           .then(data => {
//               console.log("Appointments:", data); // Debugging line
//               const appointmentsList = document.getElementById("appointmentsList");
//               appointmentsList.innerHTML = "";

//               if (data.length === 0) {
//                   appointmentsList.innerHTML = "<li>No upcoming appointments.</li>";
//                   return;
//               }

//               data.forEach(appointment => {
//                   const listItem = document.createElement("li");
//                   listItem.textContent = `📅 ${appointment.service} on ${new Date(appointment.appointment_date).toLocaleString()}`;
//                   appointmentsList.appendChild(listItem);
//               });
//           })
//           .catch(error => console.error("❌ Error fetching appointments:", error));
//   }

//   getAppointments(); // Fetch appointments on page load
// });

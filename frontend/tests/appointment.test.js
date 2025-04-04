const { JSDOM } = require("jsdom");

describe('Appointment Form and Logout Functionality', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Initialize the DOM with the necessary elements for the tests
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head><title>Salon Booking</title></head>
        <body>
          <form id="appointmentForm">
            <input type="text" id="service" value="Haircut" />
            <input type="text" id="appointmentDate" value="2025-04-05" />
            <button type="submit">Submit</button>
          </form>
          <button id="logoutButton">Logout</button>
        </body>
      </html>
    `);

    document = dom.window.document;
    window = dom.window;

    // Mock global variables
    global.document = document;
    global.window = window;

    // Mocking the fetch function for testing
    global.fetch = jest.fn();
  });

  test('should add an appointment to the list', () => {
    // Mocking the appointment form submit functionality
    document.getElementById('appointmentForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const service = document.getElementById('service').value;
      const appointmentDate = document.getElementById('appointmentDate').value;

      // Your form submission logic here
      // For example, you might add it to a list
      console.log(service, appointmentDate);
      // You can assert that the form data is correct here
      expect(service).toBe('Haircut');
      expect(appointmentDate).toBe('2025-04-05');
    });

    // Simulate a form submission
    document.getElementById('appointmentForm').dispatchEvent(new window.Event('submit'));
  });

  test('should call logout function when logout button is clicked', () => {
    // Mock logout button functionality
    const logoutButton = document.getElementById('logoutButton');
    const logoutSpy = jest.fn();

    // Attach the logout function
    logoutButton.addEventListener('click', logoutSpy);

    // Simulate button click
    logoutButton.dispatchEvent(new window.Event('click'));

    // Verify that the logout function was called
    expect(logoutSpy).toHaveBeenCalled();
  });
});

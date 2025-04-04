const fs = require("fs");
const path = require("path");

describe("login function", () => {
  beforeEach(() => {
    // Load login.html into the DOM
    const html = fs.readFileSync(
      path.resolve(__dirname, "../login.html"),
      "utf-8"
    );
    document.open();
    document.write(html);
    document.close();

    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn((key) => store[key]),
        setItem: jest.fn((key, value) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
      };
    })();
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
    });

    // Mock alert
    global.alert = jest.fn();

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "mocked_jwt_token" }),
      })
    );

    // Mock window.location.href to prevent navigation errors
    delete window.location;  // Delete the current location object
    window.location = { href: '' };  // Provide a mock for location

    // Simulate DOMContentLoaded so event listeners are attached
    jest.isolateModules(() => {
      require("../script.js");
      document.dispatchEvent(new Event("DOMContentLoaded"));
    });
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should store token in localStorage after login", async () => {
    // Fill in form
    document.getElementById("username").value = "testuser";
    document.getElementById("password").value = "testpass";

    // Submit form
    document.getElementById("loginForm").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );

    // Wait for login async code to run
    await new Promise((r) => setTimeout(r, 100));

    // Check that localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "token",
      "mocked_jwt_token"
    );
    
    // Check that alert was called
    expect(global.alert).toHaveBeenCalledWith("✅ Login successful!");
    
    // Check that window.location.href was updated
    expect(window.location.href).toBe("index.html");
  });
});

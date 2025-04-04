const request = require("supertest");
const app = require("../app");  // Adjust path as necessary
const db = require("../db");  // Import the promisePool from your db file

describe("User and Appointment Routes", () => {
  let token;

  beforeAll(async () => {
    // Register a user before running the tests
    await request(app).post("/register").send({
      username: "testuser",
      password: "testpassword",
    });

    // Log in and get the token
    const loginResponse = await request(app).post("/login").send({
      username: "testuser",
      password: "testpassword",
    });
    token = loginResponse.body.token; // Save the token for later requests
  });

  it("should register a user", async () => {
    const response = await request(app).post("/register").send({
      username: "newuser",
      password: "newpassword",
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("✅ User registered successfully");
  });

  it("should login a user and return a JWT token", async () => {
    const response = await request(app).post("/login").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("should fetch appointments with a valid token", async () => {
    const response = await request(app)
      .get("/appointments")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it("should book an appointment with a valid token", async () => {
    const response = await request(app)
      .post("/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        service: "Haircut",
        appointment_date: "2025-04-05 10:00:00",  // Corrected format
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("✅ Appointment booked successfully");
  });

  it("should return 401 for invalid token", async () => {
    const response = await request(app)
      .get("/appointments")
      .set("Authorization", "Bearer invalidToken");
    expect(response.status).toBe(401);
  });

  it("should return 403 for missing token", async () => {
    const response = await request(app).get("/appointments");
    expect(response.status).toBe(403);
  });

  afterAll(async () => {
    // Add a slight delay to give any pending async operations a chance to complete
    await new Promise(resolve => setTimeout(resolve, 2000)); // Increased delay
    await db.end(); // Ensure all connections are properly closed
    console.log('Database connection closed.');
  });
  
});

const request = require("supertest");
const app = require("../mockedAPI/index");
const fs = require("fs");

function getUserDataByUsername(username) {
  const storageFilePath = "./storage/account.json";
  const accounts = fs.readFileSync(storageFilePath, "utf-8");
  const data = JSON.parse(accounts);
  return data[username];
}

describe("GET /", () => {
  test("Successful response", async () => {
    const response = await request(app).get("/");
    expect(response.text).toBe("Backend API");
  });
});

describe("POST /user", () => {
  const userData = {
    username: "testuser",
    name: "Test Name",
    password: "testpassword",
    favouriteFruit: "apple",
    favouriteMovie: "Star Wars",
    favouriteNumber: 42,
  };

  test("Successful creation", async () => {
    const response = await request(app).post("/user").send(userData);
    expect(response.status).toBe(200);
    expect(response.text).toBe("Account Created");

    // Check if user data is written to the file
    const accounts = fs.readFileSync("./storage/account.json", "utf-8");
    const data = JSON.parse(accounts);

    // Remove the 'username' key-pair from the userData object before assertion
    const { username, ...expectedUserData } = userData;

    // Assert the presence of the newly created user
    expect(data["testuser"]).toEqual(expect.objectContaining(expectedUserData));
  });

  test("Account already exists", async () => {
    // Attempt to create a user that already exists
    const response = await request(app).post("/user").send(userData);
    expect(response.status).toBe(200);
    expect(response.text).toBe("Account Already Exists");
  });

  test("Invalid request (Pending for Dev)", async () => {
    // Send an invalid request with missing required fields
    const invalidUserData = {
      username: "testuser2", // Assuming this username doesn't already exist
      name: "Test Name 2", // Missing password field
      favouriteFruit: "banana",
    };

    const response = await request(app).post("/user").send(invalidUserData);
    expect(response.status).toBe(400);
  });
});

describe("PUT /user", () => {
  test("Successful update", async () => {
    const username = "testuser";
    const updatedUserData = {
      name: "Test UpdatedName",
      password: "updatedtestpassword",
      favouriteFruit: "orange",
      favouriteMovie: "Star Trek",
      favouriteNumber: 17,
    };

    const response = await request(app)
      .put(`/user?username=${username}`)
      .send(updatedUserData);
    expect(response.status).toBe(200);
    expect(response.text).toBe("Account Updated");

    // Additional assertions to check if the user data is updated in the mocked fs
    const userDataAfterUpdate = getUserDataByUsername(username);
    expect(userDataAfterUpdate).toEqual(
      expect.objectContaining(updatedUserData)
    );
  });

  test("Account does not exist", async () => {
    const username = "nonexistinguser";
    const response = await request(app).put(`/user?username=${username}`).send({
      name: "Updated Name",
      password: "updatedpassword",
      favouriteFruit: "banana",
      favouriteMovie: "The Matrix",
      favouriteNumber: 99,
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Account Does NOT Exist");

    const userDataNonExistingUser = getUserDataByUsername(username);
    expect(userDataNonExistingUser).toBeUndefined();
  });

  test("Invalid request (Pending for Dev)", async () => {
    const response = await request(app).put("/user");
    expect(response.status).toBe(400);
  });
});

describe("DELETE /user", () => {
  test("Successful deletion", async () => {
    const username = "testuser";
    const response = await request(app).delete(`/user?username=${username}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe("Account Deleted");

    const userDataAfterDeletion = getUserDataByUsername("testuser");
    expect(userDataAfterDeletion).toBeUndefined();
  });

  test("Account does not exist", async () => {
    const username = "nonexistinguser";
    const response = await request(app).delete(`/user?username=${username}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe("Account Does Not Exist");

    const userDataAfterDeletion = getUserDataByUsername("testuser");
    expect(userDataAfterDeletion).toBeUndefined();
  });

  test("Invalid request (Pending for Dev)", async () => {
    const response = await request(app).delete("/user");
    expect(response.status).toBe(400);
  });
});

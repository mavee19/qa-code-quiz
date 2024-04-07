describe("Login Page: Verify account page components", () => {
  before(() => {
    cy.visit("http://localhost:8081/");
  });

  it("Header title present", () => {
    cy.get(".sc-bdVaJa > div").should("have.text", "qa.code-quiz.dev");
  });

  it("User name field is present", () => {
    cy.get('[placeholder="Enter Username"]').should("be.visible");
  });

  it("Password field is present", () => {
    cy.get('[placeholder="password"]').should("be.visible");
  });

  it("Password field is either visible as asterisk or bullet sign", () => {
    cy.get('[placeholder="password"]').should("have.attr", "type", "password");
  });

  it("Login button is present", () => {
    cy.contains("button", "LOGIN").should("be.visible");
  });

  it("Contact admin message is present", () => {
    cy.get(".sc-ifAKCX > div").should(
      "have.text",
      "If you do not have an account, contact an admin"
    );
  });
});

describe("Login Page: login scenarios", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8081/");
  });

  it("Valid credentials should allow successful login", () => {
    cy.fixture("users/valid_credentials").then((validCredentials) => {
      const { username, password } = validCredentials;
      cy.login(username, password);
      cy.get(".sc-bdVaJa > div").should("have.text", "Hello SomeName");
      cy.contains("button", "LOGOUT").should("be.visible");
    });
  });

  it("Valid username with invalid password should remain on the login page or receives an error message", () => {
    cy.fixture("users/valid_username_invalid_password").then(
      (invalidCredentials) => {
        const { username, password } = invalidCredentials;
        cy.login(username, password);
        cy.contains("button", "LOGIN").should("be.visible");
        // dev should add a visible login error message
      }
    );
  });

  it("Valid username with blank password should remain on the login page or receives an error message", () => {
    cy.get('[placeholder="Enter Username"]').type("SomeUser_name");
    cy.get('[placeholder="password"]').type(" ");
    cy.contains("button", "LOGIN").click();
    cy.contains("button", "LOGIN").should("be.visible");
    // dev should add a visible login error message
  });

  it("Blank only on fields should remain on the login page or receives an error message", () => {
    cy.get('[placeholder="Enter Username"]').type(" ");
    cy.get('[placeholder="password"]').type(" ");
    cy.contains("button", "LOGIN").click();
    cy.contains("button", "LOGIN").should("be.visible");
    // dev should add a visible login error message

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
  });
});

describe("Successful Login: Account details verification", () => {
  before(() => {
    cy.visit("http://localhost:8081/");
    cy.fixture("users/valid_credentials").then((validCredentials) => {
      const { username, password, name } = validCredentials;
      cy.login(username, password);
    });
  });

  after(() => {
    cy.contains('button', 'LOGOUT').click();
  });

  it("Check greeting has the account name", () => {
    cy.get("div[class='sc-bdVaJa cCkHTg']")
      .should("have.text", "Hello SomeName");
  });

  it("Check account name is correct", () => {
    cy.get("div[class='sc-htpNat ilgFCs']")
      .contains("Name")
      .next("div")
      .should("have.text", "SomeName");
  });

  it("Check account favourite fruit is correct", () => {
    cy.get("div[class='sc-htpNat ilgFCs']")
      .contains("Favourite Fruit")
      .next("div")
      .should("have.text", "some fruit");
  });
  it("Check account favourite movie is correct", () => {
    cy.get("div[class='sc-htpNat ilgFCs']")
      .contains("Favourite Movie")
      .next("div")
      .should("have.text", "The Room");
  });
  it("Check account favourite number is correct", () => {
    cy.get("div[class='sc-htpNat ilgFCs']")
      .contains("Favourite Number")
      .next("div")
      .should("have.text", "BN<1234>");
  });
});

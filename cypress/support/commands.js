Cypress.Commands.add('login', (username, password) => {
    cy.get('[placeholder="Enter Username"]').type(username);
    cy.get('[placeholder="password"]').type(password);
    cy.contains('button', 'LOGIN').click();
  });
  
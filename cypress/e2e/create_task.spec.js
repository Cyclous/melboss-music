describe('Create New Task', () => {
  it('should create a new task and redirect', () => {
    cy.visit('/tasks/new');

    cy.get('input[name="title"]').type('New Task');
    cy.get('input[name="date"]').type('2024-07-21');
    cy.get('textarea[name="description"]').type('This is a new task');
    cy.get('button').contains('Save').click();

    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains('New Task').should('be.visible');
  });
});

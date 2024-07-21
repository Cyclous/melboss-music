// cypress/e2e/task_list.spec.js

describe('TaskList', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load and display the list of tasks', () => {
    cy.intercept('GET', 'http://localhost:3001/tasks', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Task 1',
          date: '2024-07-20',
          description: 'Description 1',
          completed: false,
          reference: 'REF12345',
        },
        {
          id: 2,
          title: 'Task 2',
          date: '2024-07-21',
          description: 'Description 2',
          completed: true,
          reference: 'REF67890',
        },
      ],
    }).as('getTasks');

    cy.wait('@getTasks');

    cy.get('h2').contains('Task 1');
    cy.get('p').contains('2024-07-20');
    cy.get('p').contains('REF12345');
    cy.get('h2').contains('Task 2');
    cy.get('p').contains('2024-07-21');
    cy.get('p').contains('REF67890');
  });

  it('should display correct button labels', () => {
    cy.get('button').contains('Español').should('be.visible');
    cy.get('button').contains('Add Task').should('be.visible');
    cy.get('button').contains('Delete').should('be.visible');
  });

  it('should delete a task on delete button click', () => {
    cy.intercept('GET', 'http://localhost:3001/tasks', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Task 1',
          date: '2024-07-20',
          description: 'Description 1',
          completed: false,
          reference: 'REF12345',
        },
        {
          id: 2,
          title: 'Task 2',
          date: '2024-07-21',
          description: 'Description 2',
          completed: true,
          reference: 'REF67890',
        },
      ],
    }).as('getTasks');

    cy.intercept('DELETE', 'http://localhost:3001/tasks/1', {
      statusCode: 200,
    }).as('deleteTask');

    cy.wait('@getTasks');

    cy.get('button').contains('Delete').first().click();
    cy.get('button').contains('Are you sure you want to delete this task?').click();

    cy.wait('@deleteTask');

    cy.get('h2').should('not.contain', 'Task 1');
    cy.get('p').should('not.contain', 'REF12345');
  });
});

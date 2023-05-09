describe('splash screen', () => {
  it('opens', () => {
    cy.visit('/');
  });
});

describe('servers list', () => {
  it('opens', () => {
    cy.visit('/servers');
  });
});

describe('server add', () => {
  const stoppedText = Cypress.env('kubernetes') ? 'Unavailable' : 'exited';

  const cleanup = (name: string) => {
    if (Cypress.env('kubernetes')) {
      cy.exec(`kubectl delete deployment ${name}`);
    } else {
      cy.exec(`docker rm ${name}`);
      cy.exec(`docker volume rm ${name}`);
    }
  };

  it('opens', () => {
    cy.visit('/servers/add');
  });

  it('adds a vanilla server', () => {
    const name = 'cypress-vanilla-test';
    cy.visit('/servers/add');

    cy.get('select').select('vanilla');
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/servers/add/vanilla');
    });

    cy.get('input').first().type(name);
    cy.get('div .input-container option').first().click();
    cy.get('button').contains('Add').click();

    cy.get('button').contains('OK').click();
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/servers');
    });

    cy.get('tr').contains(name).get('a').contains('Details').click();
    cy.get('button').contains('Stop').click();
    cy.contains(stoppedText);

    cleanup(name);
  });

  it('adds a curseforge server', () => {
    const name = 'cypress-curse-test';
    cy.visit('/servers/add');

    cy.get('select').select('curse');
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/servers/add/curse');
    });

    cy.get('input').first().type(name);
    cy.get('div .input-container option').first().click();
    cy.get('button').contains('Add').click();

    cy.get('button').contains('OK').click();
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/servers');
    });

    cy.get('tr').contains(name).get('a').contains('Details').click();
    cy.get('button').contains('Stop').click();
    cy.contains(stoppedText);

    cleanup(name);
  });
});

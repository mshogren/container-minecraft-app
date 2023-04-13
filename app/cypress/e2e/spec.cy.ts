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
  it('opens', () => {
    cy.visit('/servers/add');
  });

  it('adds a vanilla server', () => {
    const name = 'Cypress-Vanilla-Test';
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
    cy.contains('exited');

    cy.exec(`docker rm ${name}`);
    cy.exec(`docker volume rm ${name}`);
  });

  it('adds a curseforge server', () => {
    const name = 'Cypress-Curse-Test';
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
    cy.contains('exited');

    cy.exec(`docker rm ${name}`);
    cy.exec(`docker volume rm ${name}`);
  });
});

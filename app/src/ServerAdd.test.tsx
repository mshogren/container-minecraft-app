import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Client, Provider } from 'urql';
import { never } from 'wonka';
import ServerAdd from './ServerAdd';

const serverTypes = ['vanilla', 'curse'];

function createMockClient(executeQuery: CallableFunction): Client {
  return {
    executeQuery,
  } as unknown as Client;
}

function renderElement(mockClient: Client): void {
  render(
    <BrowserRouter>
      <Provider value={mockClient}>
        <ServerAdd />
      </Provider>
    </BrowserRouter>
  );
}

describe('The add server page', () => {
  it('renders correctly', async () => {
    const mockClient = createMockClient(() => never);
    renderElement(mockClient);

    await waitFor(() =>
      expect(
        screen.queryByText(
          /Please select a type of server to add from the dropdown./
        )
      ).toBeTruthy()
    );
  });

  serverTypes.concat(['']).forEach((serverType) => {
    it(`gets the value of the dropdown from the url path (${serverType})`, async () => {
      window.history.replaceState({}, '', `/${serverType}`);
      const mockClient = createMockClient(() => never);
      renderElement(mockClient);

      const combobox = await screen.findByRole('combobox');
      const options = Array.prototype.slice.call(combobox.children);
      const selected = options.filter((o: HTMLOptionElement) => o.selected)[0];

      expect(selected.value).toBe(serverType);
    });
  });

  describe('navigates', () => {
    beforeEach(() => {
      window.history.replaceState({}, '', '/');
      const mockClient = createMockClient(() => never);
      renderElement(mockClient);
    });

    serverTypes.forEach((serverType) => {
      it(`to the ${serverType} form`, async () => {
        const combobox = await screen.findByRole('combobox');
        await userEvent.selectOptions(combobox, serverType);
        expect(window.location.pathname).toBe(`/${serverType}`);
      });
    });
  });
});

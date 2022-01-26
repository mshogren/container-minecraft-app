import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Client, CombinedError, Provider } from 'urql';
import { fromValue, never } from 'wonka';
import ServerAddVanilla from './ServerAddVanilla';

function createMockClient(
  executeQuery: CallableFunction,
  executeMutation: CallableFunction = () => never
): Client {
  return {
    executeQuery,
    executeMutation,
  } as unknown as Client;
}

function renderElement(mockClient: Client): void {
  render(
    <BrowserRouter>
      <Provider value={mockClient}>
        <ServerAddVanilla />
      </Provider>
    </BrowserRouter>
  );
}

describe('The add vanilla server page', () => {
  it('shows a loading message', async () => {
    const mockClient = createMockClient(() => never);

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Loading.../)).toBeTruthy());
  });

  it('shows a network error message', async () => {
    const mockClient = createMockClient(() => {
      return fromValue({
        error: new CombinedError({
          networkError: Error('network error'),
        }),
      });
    });

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
  });

  it('shows an application error message', async () => {
    const mockClient = createMockClient(() => {
      return fromValue({
        error: new CombinedError({
          graphQLErrors: [Error('application error')],
        }),
      });
    });

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
  });
});

describe('Submitting the vanilla server form', () => {
  const testData = {
    data: {
      versions: ['v1', 'v2', 'v3'],
    },
  };

  const submitForm = async () => {
    const textbox = await screen.findByRole('textbox');
    userEvent.type(textbox, 'server1');
    const combobox = await screen.findByRole('combobox');
    userEvent.selectOptions(combobox, 'v2');
    const button = await screen.findByRole('button');
    userEvent.click(button);
  };

  it('shows a loading message', async () => {
    const mockClient = createMockClient(() => fromValue(testData));

    renderElement(mockClient);

    await submitForm();

    await waitFor(() => expect(screen.queryByText(/Adding.../)).toBeTruthy());
  });

  it('shows a network error message', async () => {
    const mockClient = createMockClient(
      () => fromValue(testData),
      () => {
        return fromValue({
          error: new CombinedError({
            networkError: Error('network error'),
          }),
        });
      }
    );

    renderElement(mockClient);

    await submitForm();

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
    await waitFor(() =>
      expect(screen.queryByText(/network error/)).toBeTruthy()
    );
  });

  it('shows an application error message', async () => {
    const mockClient = createMockClient(
      () => fromValue(testData),
      () => {
        return fromValue({
          error: new CombinedError({
            graphQLErrors: [Error('application error')],
          }),
        });
      }
    );

    renderElement(mockClient);

    await submitForm();

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
    await waitFor(() =>
      expect(screen.queryByText(/application error/)).toBeTruthy()
    );
  });

  it('shows an api error message', async () => {
    const mockClient = createMockClient(
      () => fromValue(testData),
      () => {
        return fromValue({
          data: {
            addVanillaServer: {
              error: 'api error',
            },
          },
        });
      }
    );

    renderElement(mockClient);

    await submitForm();

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
    await waitFor(() => expect(screen.queryByText(/api error/)).toBeTruthy());
  });

  it('shows a completion message', async () => {
    const mockClient = createMockClient(
      () => fromValue(testData),
      () => {
        return fromValue({
          data: {
            addVanillaServer: {
              server: {
                id: 'newId',
              },
            },
          },
        });
      }
    );

    renderElement(mockClient);

    await submitForm();

    await waitFor(() => expect(screen.queryByText(/Added/)).toBeTruthy());
  });

  it.skip('navigates to the servers page when clicking OK on the error page', async () => {
    window.history.replaceState({}, '', '/');

    const mockClient = createMockClient(
      () => fromValue(testData),
      () => {
        return fromValue({
          data: {
            addVanillaServer: {
              error: 'api error',
            },
          },
        });
      }
    );

    renderElement(mockClient);

    await submitForm();
    const button = await screen.findByRole('button');
    userEvent.click(button);

    expect(window.location.pathname).toBe('/');
  });

  it('navigates to the servers page when clicking OK on the completion page', async () => {
    window.history.replaceState({}, '', '/');

    const mockClient = createMockClient(
      () => fromValue(testData),
      () => {
        return fromValue({
          data: {
            addVanillaServer: {
              server: {
                id: 'newId',
              },
            },
          },
        });
      }
    );

    renderElement(mockClient);

    await submitForm();
    const button = await screen.findByRole('button');
    userEvent.click(button);

    expect(window.location.pathname).toBe('/servers');
  });
});

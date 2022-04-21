import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Client, CombinedError, Provider } from 'urql';
import { fromValue, makeSubject, never, pipe, take, toPromise } from 'wonka';
import ServerAddCurse from './ServerAddCurse';

function createMockClient(
  executeQuery: CallableFunction,
  executeMutation: CallableFunction = () => never
): Client {
  return {
    first: true,
    executeQuery,
    query: () => {
      const source = executeQuery();
      source.toPromise = () => {
        return pipe(source, take(1), toPromise);
      };
      return source;
    },
    executeMutation,
  } as unknown as Client;
}

function renderElement(mockClient: Client): void {
  render(
    <BrowserRouter>
      <Provider value={mockClient}>
        <ServerAddCurse />
      </Provider>
    </BrowserRouter>
  );
}

describe('The add curseforge modpack server page', () => {
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

describe('Submitting the curseforge modpack server form', () => {
  const testData = {
    data: {
      modpacks: [
        {
          id: 'Id1',
          name: 'Modpack1',
        },
        {
          id: 'Id2',
          name: 'Modpack2',
        },
        {
          id: 'Id3',
          name: 'Modpack3',
        },
      ],
    },
  };

  const serverName = 'server1';
  const modpackName = 'Modpack2';

  const submitForm = async () => {
    const textbox = await screen.findByTitle(/A name must be valid ASCII/);
    await userEvent.type(textbox, serverName);
    const option = await screen.findByText(modpackName);
    await userEvent.click(option);
    const button = await screen.findByText('Add');
    await userEvent.click(button);
  };

  it('shows a loading message', async () => {
    const { source: stream, next: pushResponse } = makeSubject();
    const mockClient = createMockClient(() => stream);

    renderElement(mockClient);

    pushResponse(testData);
    pushResponse({ data: { modpacks: [] } });

    await submitForm();

    await waitFor(() => expect(screen.queryByText(/Adding.../)).toBeTruthy());
  });

  it('shows a network error message', async () => {
    const { source: stream, next: pushResponse } = makeSubject();
    const mockClient = createMockClient(
      () => stream,
      () => {
        return fromValue({
          error: new CombinedError({
            networkError: Error('network error'),
          }),
        });
      }
    );

    renderElement(mockClient);

    pushResponse(testData);
    pushResponse({ data: { modpacks: [] } });

    await submitForm();

    await waitFor(() => {
      expect(screen.queryByText(/Error/)).toBeTruthy();
      expect(screen.queryByText(/network error/)).toBeTruthy();
    });
  });

  it('shows an application error message', async () => {
    const { source: stream, next: pushResponse } = makeSubject();
    const mockClient = createMockClient(
      () => stream,
      () => {
        return fromValue({
          error: new CombinedError({
            graphQLErrors: [Error('application error')],
          }),
        });
      }
    );

    renderElement(mockClient);

    pushResponse(testData);
    pushResponse({ data: { modpacks: [] } });

    await submitForm();

    await waitFor(() => {
      expect(screen.queryByText(/Error/)).toBeTruthy();
      expect(screen.queryByText(/application error/)).toBeTruthy();
    });
  });

  it('shows an api error message', async () => {
    const { source: stream, next: pushResponse } = makeSubject();
    const mockClient = createMockClient(
      () => stream,
      () => {
        return fromValue({
          data: {
            addCurseforgeServer: {
              error: 'api error',
            },
          },
        });
      }
    );

    renderElement(mockClient);

    pushResponse(testData);
    pushResponse({ data: { modpacks: [] } });

    await submitForm();

    await waitFor(() => {
      expect(screen.queryByText(/Error/)).toBeTruthy();
      expect(screen.queryByText(/api error/)).toBeTruthy();
    });
  });

  it('shows a completion message', async () => {
    const { source: stream, next: pushResponse } = makeSubject();

    const mockClient = createMockClient(
      () => stream,
      () => {
        return fromValue({
          data: {
            addCurseforgeServer: {
              server: {
                id: 'newId',
              },
            },
          },
        });
      }
    );

    renderElement(mockClient);

    pushResponse(testData);
    pushResponse({ data: { modpacks: [] } });

    await submitForm();

    await waitFor(() => expect(screen.queryByText(/Added/)).toBeTruthy());
  });

  it('rerenders the page when clicking OK on the error page', async () => {
    window.history.replaceState({}, '', '/');

    const { source: stream, next: pushResponse } = makeSubject();

    const mockClient = createMockClient(
      () => stream,
      () => {
        return fromValue({
          data: {
            addCurseforgeServer: {
              error: 'api error',
            },
          },
        });
      }
    );

    renderElement(mockClient);

    pushResponse(testData);
    pushResponse({ data: { modpacks: [] } });

    await submitForm();
    const button = await screen.findByRole('button');
    await userEvent.click(button);

    const textbox = await screen.findByTitle(/A name must be valid ASCII/);
    expect((textbox as HTMLInputElement).value).toBe(serverName);
    const hidden = await screen.findByTitle(/hidden/);
    expect((hidden as HTMLInputElement).value).toBe('Id2');
  });

  it('navigates to the servers page when clicking OK on the completion page', async () => {
    window.history.replaceState({}, '', '/');

    const { source: stream, next: pushResponse } = makeSubject();

    const mockClient = createMockClient(
      () => stream,
      () => {
        return fromValue({
          data: {
            addCurseforgeServer: {
              server: {
                id: 'newId',
              },
            },
          },
        });
      }
    );

    renderElement(mockClient);

    pushResponse(testData);
    pushResponse({ data: { modpacks: [] } });

    await submitForm();
    const button = await screen.findByRole('button');
    await userEvent.click(button);

    expect(window.location.pathname).toBe('/servers');
  });
});

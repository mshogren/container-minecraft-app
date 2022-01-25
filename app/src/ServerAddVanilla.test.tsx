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

    await waitFor(() => expect(screen.queryByText(/Loading.../)).toBeTruthy());
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
  });
});

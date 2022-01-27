import { ChangeEventHandler } from 'react';

export function formatDate(date: Date) {
  return new Date(Date.parse(date.toString())).toLocaleString('en-CA');
}

export function ServerNameInput(props: {
  name: string;
  onChange: ChangeEventHandler;
}) {
  const { name, onChange } = props;
  return (
    <input
      type="text"
      placeholder="Server name"
      title="A name must be valid ASCII and may contain lowercase and uppercase letters, digits, underscores, periods and dashes. A name may not start with a period or a dash and may contain a maximum of 128 characters."
      pattern="^[a-zA-Z0-9_][a-zA-Z0-9_\.-]{0,127}$"
      required
      onChange={onChange}
      value={name ?? undefined}
    />
  );
}

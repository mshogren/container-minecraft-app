import { ChangeEventHandler, MouseEventHandler, useState } from 'react';
import { FixedSizeList } from 'react-window';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {
  return true;
}

export function formatDate(date: Date) {
  return new Date(Date.parse(date.toString())).toLocaleString('en-CA');
}

export function ServerNameInput(props: {
  name: string;
  onChange: ChangeEventHandler;
}) {
  const { name, onChange } = props;
  return (
    <div className="pure-u-1">
      <input
        type="text"
        placeholder="Server name"
        title="A name must be valid ASCII and may contain lowercase and uppercase letters, digits, underscores, periods and dashes. A name may not start with a period or a dash and may contain a maximum of 128 characters."
        pattern="^[a-zA-Z0-9_][a-zA-Z0-9_\.-]{0,127}$"
        required
        onChange={onChange}
        value={name ?? undefined}
      />
    </div>
  );
}

interface ListBoxItem {
  key: string;
  value: string;
  text: string;
}

export function Listbox(props: {
  items: ListBoxItem[];
  selected: string;
  handleClick: MouseEventHandler<HTMLOptionElement>;
  className: string;
}) {
  const { items, selected, handleClick, className } = props;

  const [validated, setValidated] = useState(false as boolean);
  const handleFocus = () => {
    setValidated(true);
  };

  const selectedIndex = items.findIndex((item) => item.value === selected);
  const initialScrollOffset = selectedIndex > 4 ? (selectedIndex - 4) * 30 : 0;

  return (
    <div className={`list-container ${className}`}>
      <FixedSizeList
        className={`input-container${validated && !selected ? ' invalid' : ''}`}
        height={150}
        itemCount={items.length}
        itemSize={30}
        initialScrollOffset={initialScrollOffset}
        width="100%"
      >
        {({ index, style }) => {
          const { key, value, text } = items[index];
          const backgroundColor =
            value === selected ? 'lightblue' : style.backgroundColor;
          return (
            <option
              key={key}
              value={value}
              style={{
                ...style,
                paddingLeft: '0.5em',
                backgroundColor,
                cursor: 'default',
              }}
              onClick={handleClick}
            >
              {text}
            </option>
          );
        }}
      </FixedSizeList>
      <input
        className="list-container-hidden-input"
        title="hidden"
        type="text"
        value={selected}
        required
        onFocus={handleFocus}
        onChange={noop}
      />
    </div>
  );
}

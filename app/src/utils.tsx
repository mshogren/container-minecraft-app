import { ChangeEventHandler, MouseEventHandler, useState } from 'react';
import { List, type RowComponentProps } from 'react-window';
import { useInfiniteLoader } from 'react-window-infinite-loader';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function getEnumKeyByEnumValue<T extends { [index: string]: string }>(
  myEnum: T,
  enumValue: string
): keyof T | null {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
  return keys.length > 0 ? keys[0] : null;
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

export function InfiniteListbox(props: {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  hasError: boolean;
  items: ListBoxItem[];
  loadNextPage: () => Promise<void>;
  selected: string;
  handleClick: MouseEventHandler<HTMLOptionElement>;
  className: string;
}) {
  const {
    hasNextPage,
    isNextPageLoading,
    hasError,
    items,
    loadNextPage,
    selected,
    handleClick,
    className,
  } = props;

  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = () =>
    isNextPageLoading ? new Promise<void>(() => {}) : loadNextPage();
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  const [validated, setValidated] = useState(false as boolean);

  const handleFocus = () => {
    setValidated(true);
  };

  function ListboxRow({ index, style }: RowComponentProps) {
    if (hasError) return <div style={style}>Error :(</div>;
    if (!isItemLoaded(index))
      return (
        <div style={style}>
          <div className="loader-sm">Loading...</div>
        </div>
      );

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
  }

  const onRowsRendered = useInfiniteLoader({
    isRowLoaded: isItemLoaded,
    loadMoreRows: loadMoreItems,
    rowCount: itemCount,
  });

  return (
    <div className={`list-container ${className}`}>
      <List
        className={`input-container${validated && !selected ? ' invalid' : ''}`}
        rowComponent={ListboxRow}
        rowCount={itemCount}
        rowHeight={30}
        rowProps={{ ...props }}
        onRowsRendered={onRowsRendered}
        style={{ height: '150px' }}
      />
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

  // const selectedIndex = items.findIndex((item) => item.value === selected);
  // const initialScrollOffset = selectedIndex > 4 ? (selectedIndex - 4) * 30 : 0;

  function ListboxRow({ index, style }: RowComponentProps) {
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
  }

  return (
    <div className={`list-container ${className}`}>
      <List
        className={`input-container${validated && !selected ? ' invalid' : ''}`}
        rowComponent={ListboxRow}
        rowCount={items.length}
        rowHeight={30}
        rowProps={{ items, selected, handleClick }}
        style={{ height: '150px' }}
        // initialScrollOffset={initialScrollOffset}
      ></List>
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

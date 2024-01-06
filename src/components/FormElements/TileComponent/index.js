export default function TileComponent({ data, selected = [], onClick }) {
  return data && data.length ? (
    <div className="flex flex-wrap mt-3 items-center gap-2">
      {data.map((dataItem) => (
        <label
          onClick={() => onClick(dataItem)}
          className={`cursor-pointer ${
            selected &&
            selected.length &&
            selected.map((item) => item.id).indexOf(dataItem.id) !== -1
              ? ''
              : ''
          }`}
          key={dataItem.id}
        >
          <span
            className={`rounded-lg border border-black px-6 py-2 font-bold ${
              selected &&
              selected.length &&
              selected.map((item) => item.id).indexOf(dataItem.id) !== -1
                ? 'text-white border-2 border-green-700'
                : ''
            }`}
          >
            {dataItem.label}
          </span>
        </label>
      ))}
    </div>
  ) : null;
}

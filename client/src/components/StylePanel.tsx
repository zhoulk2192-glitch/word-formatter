import type { FormattingStyle } from "@word-formatter/shared";

interface StylePanelProps {
  styles: FormattingStyle[];
}

export function StylePanel({ styles }: StylePanelProps) {
  return (
    <aside className="style-panel" aria-label="样式面板">
      <header>
        <p className="eyebrow">Styles</p>
        <h2>样式面板</h2>
      </header>

      <div className="style-list">
        {styles.map((style) => (
          <button className="style-item" key={style.id} type="button">
            <span>{style.name}</span>
            <small>
              {style.properties.fontFamily} · {style.properties.fontSizePt}pt
            </small>
          </button>
        ))}
      </div>
    </aside>
  );
}

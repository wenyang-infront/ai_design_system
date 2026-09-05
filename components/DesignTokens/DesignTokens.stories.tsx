import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import borderTokens from '../../tokens/Border/Default.json';
import colorPrimitives from '../../tokens/Color Primitives/Color Primitives.json';
import colorSemantic from '../../tokens/Color Semantic/Color Semantic.json';
import darkElevationTokens from '../../tokens/Elevation/Dark.json';
import lightElevationTokens from '../../tokens/Elevation/Light.json';
import radiusTokens from '../../tokens/Radius/Default.json';
import spacingTokens from '../../tokens/Spacing/Default.json';
import typographyTokens from '../../tokens/Typography/Default.json';
import './DesignTokens.css';

type Token = { $value?: string | number };
type TokenMap = Record<string, Token | Record<string, unknown>>;
type TokenEntry = [name: string, token: Token];
type TypographyToken = Record<string, Token>;

const isToken = (value: unknown): value is Token => Boolean(value && typeof value === 'object' && '$value' in value);

const flattenTokens = (value: TokenMap, prefix = ''): TokenEntry[] => Object.entries(value).flatMap(([name, child]) => {
  const path = prefix ? `${prefix}.${name}` : name;
  return isToken(child) ? [[path, child]] : flattenTokens(child as TokenMap, path);
});

const primitiveEntries = flattenTokens(colorPrimitives);
const primitiveValues = new Map(primitiveEntries.map(([name, token]) => [name, String(token.$value)]));
const semanticEntries = flattenTokens(colorSemantic);
const semanticValues = new Map(semanticEntries.map(([name, token]) => [name, String(token.$value)]));

const resolveColor = (value: string): string => {
  const reference = value.match(/^\{(.+)\}$/)?.[1];
  if (!reference) return value;
  const resolved = primitiveValues.get(reference) ?? semanticValues.get(reference);
  return resolved && resolved !== value ? resolveColor(resolved) : value;
};

const scaleEntries = (value: TokenMap): TokenEntry[] => flattenTokens(value);

const typographyStyle = (name: string): CSSProperties => {
  const token = typographyTokens[name as keyof typeof typographyTokens] as TypographyToken;
  return {
    fontFamily: String(token.fontFamily.$value),
    fontSize: Number(token.fontSize.$value),
    fontWeight: Number(token.fontWeight.$value),
    letterSpacing: Number(token.letterSpacing.$value),
    lineHeight: `${Number(token.lineHeight.$value)}px`,
  };
};

const semanticColor = (name: string): string => resolveColor(String(semanticValues.get(name)));

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="design-tokens__section">
      <div className="design-tokens__section-heading">
        <span className="design-tokens__eyebrow">{eyebrow}</span>
        <h2 style={typographyStyle('headingXL')}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ColorSection() {
  const palettes = Object.entries(colorPrimitives).map(([name, palette]) => (
    <div className="design-tokens__palette" key={name}>
      <h3>{name}</h3>
      <div className="design-tokens__swatches">
        {Object.entries(palette).map(([step, token]) => {
          const value = String((token as Token).$value);
          return (
            <div className="design-tokens__swatch" key={`${name}-${step}`}>
              <div className="design-tokens__swatch-color" style={{ backgroundColor: value }} title={value} />
              <span>{step}</span>
              <code>{value}</code>
            </div>
          );
        })}
      </div>
    </div>
  ));

  return (
    <Section eyebrow="01 / color" title="Every color, accounted for.">
      <div className="design-tokens__primitive-colors">{palettes}</div>
      <div className="design-tokens__semantic">
        <h3 style={typographyStyle('headingS')}>Semantic roles</h3>
        <div className="design-tokens__semantic-groups">
          {Object.entries(colorSemantic).map(([groupName, group]) => {
            const entries = flattenTokens(group as TokenMap).map(([name, token]) => [`${groupName}.${name}`, token] as TokenEntry);
            return (
              <div className="design-tokens__semantic-group" key={groupName}>
                <h4 style={typographyStyle('labelMedium')}>{groupName}</h4>
                <div className="design-tokens__semantic-grid">
                  {entries.map(([name, token]) => {
                    const value = resolveColor(String(token.$value));
                    return (
                      <div className="design-tokens__semantic-item" key={name}>
                        <span className="design-tokens__semantic-dot" style={{ backgroundColor: value }} />
                        <span>{name.replace(`${groupName}.`, '')}</span>
                        <code>{value}</code>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function TypographySection() {
  return (
    <Section eyebrow="02 / typography" title="A scale with a voice.">
      <div className="design-tokens__type-list">
        {Object.entries(typographyTokens).map(([name, style]) => {
          const token = style as TypographyToken;
          const fontSize = Number(token.fontSize.$value);
          const lineHeight = Number(token.lineHeight.$value);
          const sampleStyle = typographyStyle(name);
          return (
            <div className="design-tokens__type-row" key={name}>
              <code>{name}</code>
              <p style={sampleStyle}>The quick brown fox jumps over the lazy dog.</p>
              <span style={typographyStyle('caption')}>{fontSize}px / {lineHeight}px / {token.fontWeight.$value}</span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function SpacingSection() {
  return (
    <Section eyebrow="03 / spacing" title="Space to make things clear.">
      <div className="design-tokens__scale-list">
        {scaleEntries(spacingTokens).map(([name, token]) => {
          const value = Number(token.$value);
          return (
            <div className="design-tokens__scale-row" key={name}>
              <code>{name}</code>
              <div className="design-tokens__space-bar" style={{ width: `${Math.max(value, 2)}px` }} />
              <span>{value}px</span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function RadiusSection() {
  return (
    <Section eyebrow="04 / radius" title="Edges with intention.">
      <div className="design-tokens__radius-grid">
        {scaleEntries(radiusTokens).map(([name, token]) => {
          const value = Number(token.$value);
          return (
            <div className="design-tokens__radius-item" key={name}>
              <div className="design-tokens__radius-box" style={{ borderRadius: value }} />
              <code>{name}</code>
              <span>{value === 9999 ? 'full' : `${value}px`}</span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ElevationSection() {
  const themes = [
    ['Light', lightElevationTokens.elevation],
    ['Dark', darkElevationTokens.elevation],
  ] as const;
  return (
    <Section eyebrow="05 / elevation" title="Depth you can feel.">
      <div className="design-tokens__elevation-themes">
        {themes.map(([theme, tokens]) => (
          <div className="design-tokens__elevation-theme" key={theme}>
            <h3>{theme}</h3>
            <div className="design-tokens__elevation-grid">
              {Object.entries(tokens).map(([level, token]) => (
                <div className="design-tokens__elevation-item" key={`${theme}-${level}`}>
                  <div className="design-tokens__elevation-card" style={{ boxShadow: token.$value }} />
                  <code>elevation.{level}</code>
                  <span>{token.$value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BorderSection() {
  return (
    <Section eyebrow="06 / border" title="Quiet lines, clear hierarchy.">
      <div className="design-tokens__border-grid">
        {scaleEntries(borderTokens).map(([name, token]) => {
          const value = Number(token.$value);
          return (
            <div className="design-tokens__border-item" key={name}>
              <div className="design-tokens__border-sample" style={{ borderWidth: value }} />
              <code>{name}</code>
              <span>{value}px</span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function DesignTokens() {
  const pageStyle = {
    '--tokens-ink': semanticColor('text.primary'),
    '--tokens-muted': semanticColor('text.secondary'),
    '--tokens-line': semanticColor('border.default'),
    '--tokens-paper': semanticColor('background.canvas'),
    '--tokens-accent': semanticColor('brand.orange.Default'),
    '--tokens-card': semanticColor('background.subtle'),
  } as CSSProperties;

  return (
    <main className="design-tokens" style={pageStyle}>
      <header className="design-tokens__hero">
        <span className="design-tokens__eyebrow" style={typographyStyle('labelXSmall')}>Foundation / design tokens</span>
        <h1 style={typographyStyle('displayLarge')}>Design<br /><em>Tokens.</em></h1>
        <p style={typographyStyle('bodyL')}>A living reference for the visual decisions behind the system.</p>
      </header>
      <ColorSection />
      <TypographySection />
      <SpacingSection />
      <RadiusSection />
      <ElevationSection />
      <BorderSection />
    </main>
  );
}

const meta = {
  title: 'Foundations/Overview',
  component: DesignTokens,
  parameters: { layout: 'fullscreen' },
  tags: ['ai-generated'],
} satisfies Meta<typeof DesignTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
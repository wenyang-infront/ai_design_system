import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import radiusTokens from '../../tokens/Radius/Default.json';
import spacingTokens from '../../tokens/Spacing/Default.json';
import typographyTokens from '../../tokens/Typography/Default.json';
import { Button } from './Button';
import './ButtonAnatomy.css';

type Token = { $value: string | number };

const spacing = (name: keyof typeof spacingTokens.space) => Number(spacingTokens.space[name].$value);
const radius = (name: keyof typeof radiusTokens.radius) => Number(radiusTokens.radius[name].$value);
const labelMedium = typographyTokens.labelMedium;
const typography = {
  family: String(labelMedium.fontFamily.$value),
  size: Number(labelMedium.fontSize.$value),
  lineHeight: Number(labelMedium.lineHeight.$value),
  weight: Number(labelMedium.fontWeight.$value),
};

function Value({ children }: { children: ReactNode }) {
  return <code className="button-anatomy__value">{children}</code>;
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="button-anatomy__detail">
      <span>{label}</span>
      <Value>{children}</Value>
    </div>
  );
}

function AnatomyDiagram() {
  const diagramStyle = {
    '--button-anatomy-padding': `${spacing('4')}px`,
    '--button-anatomy-radius': `${radius('md')}px`,
  } as CSSProperties;

  return (
    <div className="button-anatomy__diagram" style={diagramStyle}>
      <div className="button-anatomy__measure button-anatomy__measure--height">
        <span>height</span>
        <strong>32 px</strong>
      </div>
      <div className="button-anatomy__measure button-anatomy__measure--padding">
        <span>padding</span>
        <strong>16 px</strong>
      </div>
      <div className="button-anatomy__sample">
        <span className="button-anatomy__sample-label">Label</span>
      </div>
      <div className="button-anatomy__callout button-anatomy__callout--radius">
        <span>radius</span>
        <strong>{radius('md')} px</strong>
      </div>
      <div className="button-anatomy__callout button-anatomy__callout--type">
        <span>type</span>
        <strong>Label Medium</strong>
      </div>
    </div>
  );
}

function ButtonAnatomy() {
  const tokenRows = [
    ['Height', 'S / M / L', '24 / 32 / 40 px'],
    ['Padding', 'space.2 / space.4', '8 / 16 px'],
    ['Radius', 'radius.md', `${radius('md')} px`],
    ['Typography', 'labelMedium', `${typography.size} / ${typography.lineHeight} / ${typography.weight}`],
  ];

  return (
    <main className="button-anatomy">
      <header className="button-anatomy__header">
        <span className="button-anatomy__eyebrow">Components / Button</span>
        <h1>Button anatomy</h1>
        <p>The construction rules behind the default medium button.</p>
      </header>

      <section className="button-anatomy__hero" aria-labelledby="anatomy-heading">
        <div className="button-anatomy__section-heading">
          <span>01</span>
          <h2 id="anatomy-heading">Anatomy diagram</h2>
        </div>
        <AnatomyDiagram />
      </section>

      <section className="button-anatomy__specs" aria-labelledby="specs-heading">
        <div className="button-anatomy__section-heading">
          <span>02</span>
          <h2 id="specs-heading">Core measurements</h2>
        </div>
        <div className="button-anatomy__table" role="table" aria-label="Button measurements">
          {tokenRows.map(([label, token, value]) => (
            <div className="button-anatomy__row" role="row" key={label}>
              <strong role="cell">{label}</strong>
              <Value>{token}</Value>
              <span role="cell">{value}</span>
            </div>
          ))}
        </div>
        <div className="button-anatomy__details">
          <Detail label="Height">M = 32px</Detail>
          <Detail label="Padding">space.4 = {spacing('4')}px</Detail>
          <Detail label="Radius">radius.md = {radius('md')}px</Detail>
          <Detail label="Typography">{typography.family} / {typography.size}px / {typography.weight}</Detail>
        </div>
      </section>

      <section className="button-anatomy__dependencies" aria-labelledby="dependencies-heading">
        <div className="button-anatomy__section-heading">
          <span>03</span>
          <h2 id="dependencies-heading">Token dependencies</h2>
        </div>
        <div className="button-anatomy__dependency-list">
          <div><Value>space.2</Value><span>Small horizontal padding</span></div>
          <div><Value>space.4</Value><span>Default horizontal padding</span></div>
          <div><Value>radius.md</Value><span>Corner radius</span></div>
          <div><Value>labelMedium</Value><span>Label size, line height, and weight</span></div>
        </div>
      </section>

      <div className="button-anatomy__preview">
        <span>Rendered reference</span>
        <Button>Label</Button>
      </div>
    </main>
  );
}

const meta = {
  title: 'Components/Button/Anatomy',
  component: ButtonAnatomy,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ButtonAnatomy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button, type ButtonIntent, type ButtonSize, type ButtonVariant } from './Button';

const intents: ButtonIntent[] = ['primary', 'secondary', 'success', 'destructive'];
const sizes: ButtonSize[] = ['S', 'M', 'L'];
const variants: ButtonVariant[] = ['filled', 'outlined', 'text'];

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
  argTypes: {
    intent: { control: 'select', options: intents },
    size: { control: 'inline-radio', options: sizes },
    variant: { control: 'inline-radio', options: variants },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button anatomy is built from a size-specific height, horizontal padding, a medium corner radius, and the `labelMedium` typography token. These values define the button\'s proportions and keep its visual structure consistent across intents and variants.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllGroups: Story = {
  name: 'All groups, variants, and sizes',
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      {variants.map((variant) => (
        <section key={variant} aria-labelledby={`${variant}-buttons-heading`}>
          <h2 id={`${variant}-buttons-heading`}>{variant}</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {intents.map((intent) => (
              <div key={intent} style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <strong style={{ width: 96 }}>{intent}</strong>
                {sizes.map((size) => (
                  <Button key={`${intent}-${size}`} intent={intent} size={size} variant={variant}>
                    {size} button
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

export const Filled: Story = {
  args: { variant: 'filled' },
};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Text: Story = {
  args: { variant: 'text' },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Disabled button',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    'aria-label': 'Saving changes',
  },
};

export const FocusVisible: Story = {
  args: {
    autoFocus: true,
    'aria-label': 'Focused button',
  },
  parameters: {
    docs: {
      description: {
        story: 'The button receives focus on mount so the keyboard focus treatment is visible.',
      },
    },
  },
};

export const CssCheck: Story = {
  args: { children: 'Submit' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i });
    await expect(getComputedStyle(button).borderRadius).toBe('8px');
  },
};
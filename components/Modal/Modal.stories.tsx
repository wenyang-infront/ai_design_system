import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Modal } from './Modal';
const meta = { title: 'Components/Modal', component: Modal, tags: ['autodocs'], parameters: { layout: 'centered' } } satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;
function Playground() { const [open, setOpen] = useState(true); return <><Button onClick={() => setOpen(true)}>Open modal</Button><Modal onClose={() => setOpen(false)} open={open} title="Archive workspace">This action will remove the workspace from your active list.</Modal></>; }
export const Overview: Story = { render: () => <Playground /> };
export const Variants: Story = { render: () => <Playground /> };
export const States: Story = { render: () => <Playground /> };
export const Accessibility: Story = { parameters: { docs: { description: { story: 'The dialog exposes its title, modal state, focus entry point, and keyboard-operable actions.' } } }, render: () => <Playground /> };
export const TokenDependencies: Story = { parameters: { docs: { description: { story: 'Uses color.background.canvas, color.text.primary, elevation.level.3, radius.large, and spacing.300.' } } } };
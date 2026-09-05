import type { SelectHTMLAttributes } from 'react';
import '../Input/Input.css';
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label: string; options: string[]; }
export function Select({ id, label, options, ...props }: SelectProps) { const selectId = id ?? `select-${label.toLowerCase().replace(/\s+/g, '-')}`; return <label className="ds-select" htmlFor={selectId}><span className="ds-select__label">{label}</span><select {...props} className="ds-select__control" id={selectId}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
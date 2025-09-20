import React from "react";

interface DropdownProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
}

export default function Dropdown({ options, value, onChange }: DropdownProps) {
    return (
        <div>
            <select value={value} onChange={(e) => onChange(e.target.value)} className="">
                {options.map((option, index) => (
                    <option key={index} value={option.value} className="">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

"user client";

import React, { useContext } from "react";
import { FormContext } from "..";
import styles from './style.module.scss'

interface InputProps {
  type?: "text" | "password";
  name: string;
  label: string;
  placeholder?: string;
}

export function Input({ type, name, label, placeholder }: InputProps) {
  const { formValues, setFormValues } = useContext(FormContext)!;
  //  useContext(FormContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formValues[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
}

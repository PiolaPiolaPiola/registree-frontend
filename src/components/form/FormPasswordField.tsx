import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormTextField } from './FormTextField';

interface FormPasswordFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  autoComplete?: string;
  /** para mostrar el asterisco de campo obligatorio */
  required?: boolean;
}

/** Campo de contraseña con botón para mostrar u ocultar el texto */
export const FormPasswordField = <T extends FieldValues>({ name, control, label, autoComplete, required }: FormPasswordFieldProps<T>) => {
  const [visible, setVisible] = useState(false);

  return (
    <FormTextField
      name={name}
      control={control}
      label={label}
      required={required}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setVisible((current) => !current)}
                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                edge="end"
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
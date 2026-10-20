import { MenuItem, TextField } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  helperText?: string;
  disabled?: boolean;
  /** para mostrar el asterisco de campo obligatorio */
  required?: boolean;
}

export const FormSelectField = <T extends FieldValues>({ name, control, label, options, helperText, disabled, required }: FormSelectFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <TextField
        select
        fullWidth
        label={label}
        required={required}
        name={field.name}
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        inputRef={field.ref}
        disabled={disabled}
        error={Boolean(fieldState.error)}
        helperText={fieldState.error?.message ?? helperText}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    )}
  />
);
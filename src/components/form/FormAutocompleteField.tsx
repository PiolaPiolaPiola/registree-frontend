import { Autocomplete, TextField } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface FormAutocompleteFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: string[];
  helperText?: string;
  disabled?: boolean;
  /** para mostrar el asterisco de campo obligatorio */
  required?: boolean;
}

export const FormAutocompleteField = <T extends FieldValues>({ name, control, label, options, helperText, disabled, required }: FormAutocompleteFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Autocomplete
        freeSolo
        disabled={disabled}
        options={options}
        value={field.value ?? ''}
        inputValue={field.value ?? ''}
        onInputChange={(_, value) => field.onChange(value)}
        onBlur={field.onBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            name={field.name}
            inputRef={field.ref}
            label={label}
            required={required}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? helperText}
          />
        )}
      />
    )}
  />
);

import { Autocomplete, TextField } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface FormAutocompleteFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: string[];
  helperText?: string;
}

export const FormAutocompleteField = <T extends FieldValues>({ name, control, label, options, helperText }: FormAutocompleteFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Autocomplete
        freeSolo
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
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? helperText}
          />
        )}
      />
    )}
  />
);

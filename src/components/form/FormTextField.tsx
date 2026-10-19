import { TextField, type TextFieldProps } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

type FormTextFieldProps<T extends FieldValues> = Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur'> & {
  name: Path<T>;
  control: Control<T>;
};

/**Componente reutilizable de input text con valdiaciones estándar*/
export const FormTextField = <T extends FieldValues>({ name, control, helperText, ...props }: FormTextFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <TextField
        {...props}
        name={field.name}
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        inputRef={field.ref}
        error={Boolean(fieldState.error)}
        helperText={fieldState.error?.message ?? helperText}
        fullWidth
      />
    )}
  />
);
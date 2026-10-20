import { Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloseRounded, FilterAltOffOutlined, SearchRounded } from '@mui/icons-material';
import type { Dayjs } from 'dayjs';

interface ProductFiltersBarProps {
  search: string;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onFromDateChange: (value: Dayjs | null) => void;
  onToDateChange: (value: Dayjs | null) => void;
  onClear: () => void;
}

/** Búsqueda por título y rango de fechas de creación*/
export const ProductFiltersBar = ({
  search,
  fromDate,
  toDate,
  hasFilters,
  onSearchChange,
  onFromDateChange,
  onToDateChange,
  onClear,
}: ProductFiltersBarProps) => (
  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ p: 2, alignItems: { md: 'center' } }}>
    <TextField
      size="small"
      placeholder="Buscar por título…"
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
      sx={{ flex: 1, minWidth: { md: 260 } }}
      slotProps={{
        htmlInput: { 'aria-label': 'Buscar productos por título', maxLength: 100 },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: search && (
            <InputAdornment position="end">
              <IconButton size="small" aria-label="Borrar búsqueda" onClick={() => onSearchChange('')}>
                <CloseRounded fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
    <Stack direction="row" spacing={1.5}>
      <DatePicker
        label="Desde"
        value={fromDate}
        onChange={onFromDateChange}
        maxDate={toDate ?? undefined}
        disableFuture
        slotProps={{ textField: { size: 'small' }, field: { clearable: true } }}
        sx={{ width: { xs: '100%', md: 220 } }}
      />
      <DatePicker
        label="Hasta"
        value={toDate}
        onChange={onToDateChange}
        minDate={fromDate ?? undefined}
        disableFuture
        slotProps={{ textField: { size: 'small' }, field: { clearable: true } }}
        sx={{ width: { xs: '100%', md: 220 } }}
      />
    </Stack>
        <Button
        variant="text"
        startIcon={<FilterAltOffOutlined />}
        onClick={onClear}
        disabled={!hasFilters}
        aria-hidden={!hasFilters}
        sx={{ flex: 'none', visibility: hasFilters ? 'visible' : 'hidden' }}
        >
        Limpiar filtros
        </Button>
  </Stack>
);
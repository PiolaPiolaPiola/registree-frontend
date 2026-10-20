import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { PageHeader } from '../components/layout/PageHeader';
import { useProductsData } from '../hooks/useProductsData';

interface PlaceholderViewProps {
  title: string;
}

/** Vista temporal. Muestra el estado de la caché de productos para probar el Check 9 */
export const PlaceholderView = ({ title }: PlaceholderViewProps) => {
  const { products, status, isRefreshing, error, lastUpdated, refresh } = useProductsData();

  return (
    <>
      <PageHeader title={title} subtitle="Contenido en construcción" />
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography>Estado: <strong>{status}</strong> {isRefreshing && '(actualizando…)'}</Typography>
            <Typography>Productos en caché: <strong>{products.length}</strong></Typography>
            <Typography>Última actualización: {lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}</Typography>
            {error && <Typography color="error">Error: {error}</Typography>}
            <Button variant="outlined" onClick={refresh} sx={{ alignSelf: 'flex-start' }}>
              Actualizar
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
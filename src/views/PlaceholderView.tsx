import { Card, CardContent, Typography } from '@mui/material';
import { PageHeader } from '../components/layout/PageHeader';

interface PlaceholderViewProps {
  title: string;
}

export const PlaceholderView = ({ title }: PlaceholderViewProps) => (
  <>
    <PageHeader title={title} subtitle="Contenido en construcción" />
    <Card>
      <CardContent>
        <Typography variant="body2">Esta sección se construye en los siguientes checks.</Typography>
      </CardContent>
    </Card>
  </>
);
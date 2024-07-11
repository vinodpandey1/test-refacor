import * as React from 'react';
import Box from '@mui/material/Box';
import LinearDeterminate from'./LinearProgress'

interface LoaderProps {
  loading: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ loading }) => {
  return loading ? (
    <Box sx={{ width: '100%' }}>
      <LinearDeterminate />
    </Box>
  ) : null;
};

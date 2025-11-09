// src/app/shader-test/page.tsx
'use client';

import { Container, Box } from '@mui/material';
import ShaderHelloWorld from '@/components/HelloWorld';

export default function ShaderTestPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4, color: 'white' }}>
        <ShaderHelloWorld />
      </Box>
    </Container>
  );
}
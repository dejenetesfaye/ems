import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ModernCard = ({ title, children, action, sx = {} }) => (
  <Card
    elevation={6}
    sx={{
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(249,250,253,0.85))',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      ':hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 14px 30px rgba(15, 23, 42, 0.15)',
      },
      ...sx,
    }}
  >
    <CardContent>
      {title && (
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
      )}
      {action}
      {children}
    </CardContent>
  </Card>
);

export default ModernCard;

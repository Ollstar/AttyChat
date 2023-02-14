"use client"
import React from 'react';
import { styled } from '@mui/material/styles';

const DrawerSpacer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function DrawerSpacerComp() {
  return <DrawerSpacer />;
}

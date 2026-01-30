import React from 'react';

export enum Page {
  HOME = 'home',
  PROGRAM = 'program',
  RESULTS = 'results',
  ABOUT = 'about'
}

export interface NavItem {
  label: string;
  page: Page;
}

export interface Stat {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}

export interface NewsItem {
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}
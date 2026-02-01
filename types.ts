import React from 'react';

export interface NavItem {
  label: string;
  to: string;
}

export interface Stat {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}

export interface NewsItem {
  category: string;
  color: string;
  title: string;
  desc: string;
  date: string;
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  desc: string;
  img: string;
}

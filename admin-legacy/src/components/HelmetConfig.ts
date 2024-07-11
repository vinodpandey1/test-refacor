import React from 'react';
import { Helmet } from 'react-helmet';

export interface Config { // <-- Export the Config type
  title: string;
  // Add other configuration options here if needed
}

const getDefaultConfig = (): Config => {
  return {
    title: 'Default Title',
    // Add other default configuration options here if needed
  };
};

const getDynamicConfig = (pageTitle: string): Config => {
  return {
    title: pageTitle,
    // Add other dynamic configuration options here if needed
  };
};

const generateConfig = (pageTitle: string | undefined): Config => {
  return pageTitle ? getDynamicConfig(pageTitle) : getDefaultConfig();
};

export default generateConfig;

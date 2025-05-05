#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PlotlineStack } from '../lib/plotline-stack';

const app = new cdk.App();
new PlotlineStack(app, 'PlotlineStack', {
  env: { account: '339713135502', region: 'us-east-1' },
});

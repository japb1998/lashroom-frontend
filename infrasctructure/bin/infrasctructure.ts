#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrasctructureStack } from '../lib/infrasctructure-stack';

const app = new cdk.App();
new InfrasctructureStack(app, 'InfrasctructureStack', {
});
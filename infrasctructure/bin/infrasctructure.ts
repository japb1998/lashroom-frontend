#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrasctructureStack } from '../lib/infrasctructure-stack';

const app = new cdk.App();
const stage = process.env.STAGE ?? 'dev';

if (!process.env.PROJECT) {
    throw new Error('Project Name is required')
}
new InfrasctructureStack(app, `${process.env.PROJECT}-FrontEnd-${stage}`, {
});
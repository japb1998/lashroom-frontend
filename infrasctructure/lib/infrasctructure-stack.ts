import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StaticSite } from './staticSite.construct';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfrasctructureStack extends cdk.Stack {
  stage: string = process.env.STAGE ?? 'dev'
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new StaticSite(this, `${process.env.PROJECT}-StaticSite-${this.stage}`,{})
  }
}

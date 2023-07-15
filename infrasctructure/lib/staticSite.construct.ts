import * as cdk from 'aws-cdk-lib'
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path = require('path');

export class StatisSite extends Construct {

    stage: string = process.env.STAGE ?? 'dev';
    bucketName?: string = process.env.PROJECT;

    constructor(parent:Construct, name: string, props?:any) {
        super(parent, name);
        const bucket = new Bucket(this, 'Bucket', {
            accessControl: BucketAccessControl.PRIVATE,
            bucketName: `frontend-${this.bucketName}-${this.stage}`
          })

        

        const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
        bucket.grantRead(originAccessIdentity);

        const distribution = new Distribution(this, 'Distribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
              origin: new S3Origin(bucket, {originAccessIdentity}),
            },
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/'
                }
            ]
        });

        new BucketDeployment(this, `BucketDeployment${this.stage}`, {
            destinationBucket: bucket,
            sources: [Source.asset(path.resolve(__dirname, '../../dist/lashroom-frontend'))],
            distribution,
            distributionPaths: ['/*']
        });
    }
    
}
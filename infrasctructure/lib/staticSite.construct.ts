import * as cdk from 'aws-cdk-lib'
import { Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path = require('path');

export class StaticSite extends Construct {

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
              viewerProtocolPolicy:  ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            },
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/'
                }
            ]
        });
        new BucketDeployment(this, `${process.env.PROJECT}-BucketDeployment-${this.stage}`, {
            destinationBucket: bucket,
            sources: [Source.asset(path.resolve(__dirname, '../../dist/lashroom-frontend'))],
            distribution,
            distributionPaths: ['/*']
        });
    }
    
}
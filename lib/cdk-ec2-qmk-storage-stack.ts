import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as deployment from '@aws-cdk/aws-s3-deployment';
import * as path from 'path'

export class CdkEc2QmkStorageStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const bucket = new s3.Bucket(this, 'KeyboardDataBucket', { removalPolicy: cdk.RemovalPolicy.DESTROY })
    
    new deployment.BucketDeployment(this, 'KeyboardSamle1', {
      sources: [
        deployment.Source.asset(path.join(__dirname, '..', 'sample', '2key2crawl'))
      ],
      destinationBucket: bucket,
      destinationKeyPrefix: 'keyboards/2key2crawl/'
    })
    
    new deployment.BucketDeployment(this, 'KeyboardSamle2', {
      sources: [
        deployment.Source.asset(path.join(__dirname, '..', 'sample', 'suzuki'))
      ],
      destinationBucket: bucket,
      destinationKeyPrefix: 'keyboards/suzuki/'
    })
    
    new cdk.CfnOutput(this, 'KeyboardDataBucketOutput', { 
      exportName: this.node.tryGetContext('bucketname_exportname'), 
      value: bucket.bucketName 
    })
    
  }
}
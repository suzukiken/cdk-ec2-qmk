#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkEc2QmkStorageStack } from '../lib/cdk-ec2-qmk-storage-stack';
import { CdkEc2QmkStack } from '../lib/cdk-ec2-qmk-stack';
import { CdkEc2QmkFunctionStack } from '../lib/cdk-ec2-qmk-function-stack';

const app = new cdk.App();

const storage = new CdkEc2QmkStorageStack(app, 'CdkEc2QmkStorageStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
const ec2 = new CdkEc2QmkStack(app, 'CdkEc2QmkStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
const lambda = new CdkEc2QmkFunctionStack(app, 'CdkEc2QmkFunctionStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

lambda.addDependency(ec2)
lambda.addDependency(storage)

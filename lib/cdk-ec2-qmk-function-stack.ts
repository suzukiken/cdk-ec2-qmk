import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import { PythonFunction } from "@aws-cdk/aws-lambda-python";

export class CdkEc2QmkFunctionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const bucketname = cdk.Fn.importValue(this.node.tryGetContext('bucketname_exportname'))
    const bucket = s3.Bucket.fromBucketName(this, 'Bucket', bucketname)
    const hostip = cdk.Fn.importValue(this.node.tryGetContext('ec2_publicip_exportname'))
    /*
    const vpc_id = this.node.tryGetContext('vpc_id')
    const vpc_name = this.node.tryGetContext('vpc_name')
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: vpc_id, vpcName: vpc_name })
    
    const securitygroup_id = cdk.Fn.importValue(this.node.tryGetContext('vpclambda_securitygroupid_exportname'))
    const subnet_id = cdk.Fn.importValue(this.node.tryGetContext('public_subnetid_exportname'))
    const subnet = ec2.Subnet.fromSubnetId(this, 'Subnet', subnet_id)
    */
    
    const lambda_function = new PythonFunction(this, "CompilerCallerFunction", {
      entry: "lambda",
      index: "caller.py",
      handler: "lambda_handler",
      runtime: lambda.Runtime.PYTHON_3_8,
      timeout: cdk.Duration.seconds(60),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        KEY_PREFIX: 'keyboards',
        QMK_URL: 'http://' + hostip + '/'
      },
      /*
      vpc: vpc,
      vpcSubnets: { subnets: [ subnet ] },
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(this, 'LambdaSecurityGrp', securitygroup_id)
      */
    })
    
    bucket.grantReadWrite(lambda_function)

  }
}

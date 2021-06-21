import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { PythonFunction } from "@aws-cdk/aws-lambda-python";

export class CdkEc2QmkFunctionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const bucketname = cdk.Fn.importValue(this.node.tryGetContext('bucketname_exportname'))
    const publicip = cdk.Fn.importValue(this.node.tryGetContext('ec2_publicip_exportname'))
    
    const lambda_function = new PythonFunction(this, "CompilerCallerFunction", {
      entry: "lambda",
      index: "caller.py",
      handler: "lambda_handler",
      runtime: lambda.Runtime.PYTHON_3_8,
      timeout: cdk.Duration.seconds(60),
      environment: {
        BUCKET_NAME: bucketname,
        KEY_PREFIX: 'keyboards',
        QMK_URL: 'http://' + publicip + '/gen/'
      }
    })

  }
}

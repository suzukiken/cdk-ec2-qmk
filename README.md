# Welcome to your CDK TypeScript project!


## commands

 * `cdk deploy CdkEc2QmkStorageStack`
 * `cdk deploy CdkEc2QmkSecgrpEc2Stack`
 * `cdk deploy CdkEc2QmkSecgrpLbtgtStack`
 * `cdk deploy CdkEc2QmkEc2Stack`
 * `cdk deploy CdkEc2QmkAutoscalingStack`
 * `cdk deploy CdkEc2QmkFunctionStack`
 
## How to 

1. create CdkEc2QmkEc2Stack.
2. make the ec2 instance AMI.
3. delete the ec2 instance.
3. set the AMI id to cdk.json.
4. launch service using CdkEc2QmkAutoscalingStack.
 
## Login to Ec2 Instance

 * `ssh admin@172.30.1.xxx -i ~/.ssh/xxxxxxxxx.pem`

## Send file to Ec2 Instance

 * `scp userdata/tornado_server.py admin@172.30.1.xxx:/opt`
 * `scp -i ~/.ssh/figment-researchawsserver.pem userdata/tornado_server.py admin@172.30.1.149:/opt`
 * 
 
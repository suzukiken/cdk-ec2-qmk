# Welcome to your CDK TypeScript project!


## commands

 * `cdk deploy CdkEc2QmkStorageStack`
 * `cdk deploy CdkEc2QmkStack`
 * `cdk deploy CdkEc2QmkFunctionStack`
 
## Login to Ec2 Instance

 * `ssh admin@172.30.1.xxx -i ~/.ssh/xxxxxxxxx.pem`

## Send file to Ec2 Instance

 * `scp userdata/tornado_server.py admin@172.30.1.xxx:/opt`
 * `scp -i ~/.ssh/figment-researchawsserver.pem userdata/tornado_server.py admin@172.30.1.149:/opt`
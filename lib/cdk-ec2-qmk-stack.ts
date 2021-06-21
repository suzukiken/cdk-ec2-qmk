import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as assets from '@aws-cdk/aws-s3-assets';
import * as s3 from '@aws-cdk/aws-s3';
import * as path from 'path'

export class CdkEc2QmkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpc_id = this.node.tryGetContext('vpc_id')
    const ami_id = this.node.tryGetContext('ami_id')
    const key_name = this.node.tryGetContext('key_name')
    const securitygroup_id = this.node.tryGetContext('securitygroup_id')
    const bucketname = cdk.Fn.importValue(this.node.tryGetContext('bucketname_exportname'))
    
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: vpc_id })
    const bucket = s3.Bucket.fromBucketName(this, 'Bucket', bucketname)
    
    const asset = new assets.Asset(this, 'UserdataAsset', {
      path: path.join(__dirname, '..', 'userdata'),
    })
    
    const userData = ec2.UserData.forLinux()
    userData.addCommands('apt update')
    // userData.addCommands('apt upgrade -y')
    userData.addCommands('apt install unzip -y')
    userData.addCommands('apt install python3-pip -y')
    userData.addCommands('curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"')
    userData.addCommands('unzip awscliv2.zip')
    userData.addCommands('./aws/install')
    userData.addCommands(
      cdk.Fn.join(" ", [
        'aws s3api get-object --bucket', 
        asset.s3BucketName, 
        '--key', 
        asset.s3ObjectKey, 
        '/tmp/userdata.zip'
      ])
    )
    userData.addCommands('unzip /tmp/userdata.zip')
    userData.addCommands('chmod +x initialize.sh')
    userData.addCommands('./initialize.sh')

    const linux = ec2.MachineImage.genericLinux({
      'ap-northeast-1': ami_id
    })
    
    const role = new iam.Role(this, "Role", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "CloudWatchAgentServerPolicy",
        )
      ]
    })

    const instance = new ec2.Instance(this, 'Instance', {
      vpc: vpc,
      machineImage: linux,
      instanceType: new ec2.InstanceType('t3.nano'),
      role: role,
      keyName: key_name,
      userData: userData,
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(this, 'Ec2SecurityGrp', securitygroup_id)
    })
    
    asset.grantRead( instance.role )
    bucket.grantReadWrite( instance.role )
    
    new cdk.CfnOutput(this, 'PrivateIp', { 
      exportName: this.node.tryGetContext('ec2_privateip_exportname'),
      value: instance.instancePrivateIp
    })
    
    new cdk.CfnOutput(this, 'PublicIp', { 
      exportName: this.node.tryGetContext('ec2_publicip_exportname'),
      value: instance.instancePublicIp
    })
    
  }
}

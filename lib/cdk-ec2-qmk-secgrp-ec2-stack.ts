import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

export class CdkEc2QmkSecgrpEc2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpc_id = this.node.tryGetContext('vpc_id')
    const vpc_name = this.node.tryGetContext('vpc_name')
    const alb_arn = this.node.tryGetContext('alb_arn')
    
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: vpc_id, vpcName: vpc_name })
    
    const security_group = new ec2.SecurityGroup(this, 'Ec2SecurityGrp', { 
      vpc: vpc, 
      allowAllOutbound: true
    })
    
    security_group.addIngressRule(ec2.Peer.ipv4('10.0.0.0/16'), ec2.Port.tcp(80))
    security_group.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80))
    
    new cdk.CfnOutput(this, 'Ec2SecGrpOutput', { 
      exportName: this.node.tryGetContext('ec2standalone_securitygroupid_exportname'), 
      value: security_group.securityGroupId 
    })
  }
}

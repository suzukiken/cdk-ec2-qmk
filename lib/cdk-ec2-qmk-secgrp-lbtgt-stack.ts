import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

export class CdkEc2QmkSecgrpLbtgtStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpc_id = this.node.tryGetContext('vpc_id')
    const vpc_name = this.node.tryGetContext('vpc_name')
    const lb_securitygroup_id = cdk.Fn.importValue(this.node.tryGetContext('lb_securitygroupid_exportname'))
    
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: vpc_id, vpcName: vpc_name })
    
    const lb_security_group = ec2.SecurityGroup.fromSecurityGroupId(this, 'LbSecurityGrp', lb_securitygroup_id)
    
    const target_security_group = new ec2.SecurityGroup(this, 'Ec2SecurityGrp', { 
      vpc: vpc, 
      allowAllOutbound: true
    })
    
    target_security_group.addIngressRule(lb_security_group, ec2.Port.tcp(80))
    
    new cdk.CfnOutput(this, 'TargetSecGrpOutput', { 
      exportName: this.node.tryGetContext('lbtarget_securitygroupid_exportname'), 
      value: target_security_group.securityGroupId 
    })
  }
}

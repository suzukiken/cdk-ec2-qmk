import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets/lib';

export class CdkEc2QmkAutoscalingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpc_id = this.node.tryGetContext('vpcid_exportname')
    const securitygroup_id = cdk.Fn.importValue(this.node.tryGetContext('securitygroupid_exportname'))
    const alb_arn = this.node.tryGetContext('albarn_exportname')
    
    const ami_id = this.node.tryGetContext('private_ami_id')
    const domain = this.node.tryGetContext('domain')
    const subdomain = this.node.tryGetContext('subdomain')
    const host = subdomain + '.' + domain
    
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: vpc_id,  })
    const security_group = ec2.SecurityGroup.fromSecurityGroupId(this, 'Ec2SecurityGrp', securitygroup_id)
    
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
    
    const asgrop = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.NANO),
      machineImage: linux,
      securityGroup: security_group,
      role: role,
      minCapacity: 1,
      maxCapacity: 1
    })
    
    const alb = elbv2.ApplicationLoadBalancer.fromLookup(this, 'Alb', {
      loadBalancerArn: alb_arn
    })
    
    const listener = elbv2.ApplicationListener.fromLookup(this, 'HttpsListener', {
      listenerArn: this.node.tryGetContext('alb_listenerarn_https_exportname')
    })
    
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'TargetGroup', {
      port: 80,
      targets: [asgrop],
      vpc: vpc
    })
    
    listener.addTargetGroups('Groups', {
      targetGroups: [targetGroup], 
      conditions: [
         elbv2.ListenerCondition.hostHeaders([host])  
      ],
      priority: 10
    })
    
    const zone = route53.HostedZone.fromLookup(this, "zone", {
      domainName: domain,
    })
    
    const record = new route53.ARecord(this, "record", {
      recordName: subdomain,
      target: route53.RecordTarget.fromAlias(
        new targets.LoadBalancerTarget(alb)
      ),
      zone: zone,
    })
  }
}

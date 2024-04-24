import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwscdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const defaultVpc = ec2.Vpc.fromLookup(this, "Default", { isDefault: true });
    const mySecurityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc: defaultVpc,
      allowAllOutbound: true,
      securityGroupName: "Security Group for VM",
    });
    mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(8080),
      "Security Group Inbound Rule"
    );
    mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), ec2.Port.tcp(8080), "HTTP 8080 Port"
     )
     mySecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "SSH Port"
     )
    // instance to add as the target for load balancer.
    const instance = new ec2.Instance(this, "targetInstance", {
      vpc: defaultVpc,
      instanceName: "CDKInstance",
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO
      ),
      
      
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      securityGroup: mySecurityGroup,
      keyPair: ec2.KeyPair.fromKeyPairName(this, "keypair", "devops")
    });


    // example resource
    // const queue = new sqs.Queue(this, 'AwscdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}

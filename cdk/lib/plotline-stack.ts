import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Billing, Capacity, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export class PlotlineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const lambda = this.createLambdaFunction();

        const movieTable = this.createDynamoTable("plotline-movies", "tmdbId");
        const showTable = this.createDynamoTable("plotline-shows", "tmdbId");

        const plotlineAPI = this.createAPIGateway(lambda);

        movieTable.grantFullAccess(lambda);
        showTable.grantFullAccess(lambda);
    }

    private createDynamoTable(tableName: string, partitionKey: string): TableV2 {
        return new TableV2(this, tableName, {
            tableName: tableName,
            partitionKey: { name: partitionKey, type: AttributeType.NUMBER },
            billing: Billing.provisioned({
                readCapacity: Capacity.fixed(3),
                writeCapacity: Capacity.autoscaled({ minCapacity: 3, maxCapacity: 3 })
            }),
        });
    }

    private createLambdaFunction(): Function {
        return new Function(this, "plotline-lambda", {
            functionName: "plotline-lambda",
            code: Code.fromAsset(path.join(__dirname, '../../lambda-handler/dist')),
            handler: "bundle.handler",
            memorySize: 512,
            timeout: Duration.minutes(1),
            runtime: Runtime.NODEJS_22_X,
            environment: {
                TMDB_TOKEN: process.env.TMDB_TOKEN!,
                JWT_SECRET: process.env.JWT_SECRET!,
                USERNAME: process.env.USERNAME!,
                PASS: process.env.PASS!,
            }
        });
    }

    private createAPIGateway(handler: Function): LambdaRestApi {
        return new LambdaRestApi(this, "plotline-api", {
            restApiName: "plotline-api",
            handler: handler,
            proxy: true,
            defaultCorsPreflightOptions: {
                allowOrigins: ["*"]
            },

            deployOptions: {
                stageName: "v1",
                methodOptions: {
                    "/*/*": {
                        throttlingBurstLimit: 1,
                        throttlingRateLimit: 0.25
                    }
                }
            },
            deploy: true
        });
    }
}

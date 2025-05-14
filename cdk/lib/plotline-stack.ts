import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Deployment, LambdaRestApi, Stage } from 'aws-cdk-lib/aws-apigateway';
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
            }
        });
    }

    private createAPIGateway(handler: Function): LambdaRestApi {
        return new LambdaRestApi(this, "plotline-api", {
            handler: handler,
            proxy: true,
            deployOptions: {
                stageName: "v1"
            },
            deploy: true
        });
    }
}

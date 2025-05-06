import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Billing, Capacity, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export class PlotlineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const movieTable = this.createDynamoTable("plotline-movies", "tmdb-id");
        const showTable = this.createDynamoTable("plotline-shows", "tmdb-id");

        const lambda = this.createLambdaFunction();
    }

    private createDynamoTable(tableName: string, partitionKey: string): TableV2 {
        return new TableV2(this, tableName, {
            tableName: tableName,
            partitionKey: { name: partitionKey, type: AttributeType.STRING },
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
            runtime: Runtime.NODEJS_22_X,
            environment: {
                TMDB_TOKEN: process.env.TMDB_TOKEN!,
            }
        });
    }
}

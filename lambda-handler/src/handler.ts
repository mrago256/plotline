import { APIGatewayEvent, Context } from 'aws-lambda';
import { getShowById, searchByName } from './adapter/tmdbAdapter';
import { addMovieToList } from './adapter/dynamoDBAdapter';

export const handler = async (event: APIGatewayEvent, context: Context) => {
    await testCall();
    // use api gateway to accept multiple endpoints, but have it eoter add to event, or maybe
    // its included by default in the event
};

async function testCall() {
    const yo = await getShowById(60573);
    console.log("Test show:", yo);
    // addMovieToList(yo);
}

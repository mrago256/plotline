import { APIGatewayEvent, Context } from 'aws-lambda';
import { addShowToList, getAllSavedMovies, getAllSavedShows, queryByName } from './helper/plotlineHelper';

export const handler = async (event: APIGatewayEvent, context: Context) => {
    // use api gateway to accept multiple endpoints, but have it eoter add to event, or maybe
    // its included by default in the event
    // console.log("List:", await getSavedList(EntryType.movie));

    const showToAdd = await queryByName("Silicon valle");
    console.log("Show to add:", showToAdd[0]);

    await addShowToList(showToAdd[0].tmdbId);
    console.log("Added show");

    console.log("All shows:", await getAllSavedShows());
};

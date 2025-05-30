import Accommodation from "../models/Accommodation.js";
import Restaurant from "../models/Restaurant.js";
import Activity from "../models/Activity.js";
import Transportation from "../models/Transportation.js";

export async function findDocumentByPropertyToken(propertyToken, itemType) {
    const modelMap = {
        accommodations: Accommodation,
        restaurants: Restaurant,
        activities: Activity,
        transportation: Transportation,
    };

    switch(itemType) {
        case "accommodation":
            itemType = "accommodations";
            break;
        case "restaurant":
            itemType = "restaurants";
            break;
        case "activity":
            itemType = "activities"
            break;

    }
    const Model = modelMap[itemType];
    if (!Model) {
        throw new Error("Invalid item type");
    }

    let query = {};

    switch (itemType) {
        case "accommodations":
            query = { "serpData.properties.property_token": propertyToken };
            break;
        case "restaurants":
        case "activities":
            query = { "serpData.local_results.place_id": propertyToken };
            break;
        case "transportation":
            // query = { "serpData.flights.unique_flight_id_key": favoriteId };
            console.warn(`Transportation query in findDocumentByFavoriteId needs specific implementation based on stored ID and data structure.`);
            throw new Error(`Query for transportation favorites not yet implemented in findDocumentByFavoriteId.`);
            // break;
        default:
            throw new Error(`Unhandled item type for query construction: ${itemType}`);
    }

    const doc = await Model.findOne(query);

    if (!doc) {
        throw new Error(`No document found with property_token ${propertyToken} in ${itemType}`);
    }

    return doc;
}
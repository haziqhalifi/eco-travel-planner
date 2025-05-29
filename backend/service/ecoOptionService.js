import Accommodation from "../models/Accommodation.js";
import Restaurant from "../models/Restaurant.js";
import Activity from "../models/Activity.js";
import Transportation from "../models/Transportation.js";

export async function findDocumentIdByPropertyToken(propertyToken, itemType) {
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

    const doc = await Model.findOne({ "serpData.properties.property_token": propertyToken });

    if (!doc) {
        throw new Error(`No document found with property_token ${propertyToken} in ${itemType}`);
    }

    return doc._id;
}
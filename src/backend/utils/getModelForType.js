import Accommodation from '../models/Accommodation.js';
import Transportation from '../models/Transportation.js';
import Restaurant from '../models/Restaurant.js';
import Activity from '../models/Activity.js';

const getModelForType = (type) => {
    switch (type) {
        case 'accommodation': return Accommodation;
        case 'transportation': return Transportation;
        case 'restaurant': return Restaurant;
        case 'activity': return Activity;
        default: throw new Error('Invalid search type');
    }
};

export default getModelForType;
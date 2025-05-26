import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: {
        accommodations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' }],
        restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
        activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
        transportation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transportation' }],
    },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare hashed passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
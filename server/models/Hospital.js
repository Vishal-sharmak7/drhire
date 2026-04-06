import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const hospitalSchema = new mongoose.Schema({
    hospitalName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    role: { type: String, enum: ["doctor", "hospital", "admin"], default: "hospital" },
    jobsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, {
    timestamps: true
});

hospitalSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

hospitalSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    licenseNumber: { type: String, required: true },
    skills: [{ type: String }],
    resume: { type: String },
    role: { type: String, enum: ["doctor", "hospital", "admin"], default: "doctor" },
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, {
    timestamps: true
});

doctorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

doctorSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;

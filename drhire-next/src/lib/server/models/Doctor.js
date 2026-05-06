import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    authProvider: { type: String, enum: ['credentials', 'google'], default: 'credentials' },
    providerId: { type: String },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    licenseNumber: { type: String, required: true },
    skills: [{ type: String }],
    resume: { type: String },
    role: { type: String, enum: ['doctor', 'hospital', 'admin'], default: 'doctor' },
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  },
  {
    timestamps: true,
  }
);

doctorSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

doctorSchema.pre('save', async function savePassword() {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

export default Doctor;

import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    specialization: { type: String, required: true },
    experienceRequired: { type: Number, required: true },
    salaryRange: { type: String },
    location: { type: String, required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export default Job;

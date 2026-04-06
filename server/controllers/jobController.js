import Job from '../models/Job.js';
import Doctor from '../models/Doctor.js';
import Hospital from '../models/Hospital.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
    try {
        const { keyword, specialization, location, experience } = req.query;

        let query = {};
        if (keyword) query.title = { $regex: keyword, $options: 'i' };
        if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };
        if (experience) query.experienceRequired = { $lte: Number(experience) };

        const jobs = await Job.find(query).populate('hospitalId', 'hospitalName location');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('hospitalId', 'hospitalName location description');

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Hospital)
export const createJob = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user.id || req.user._id);
        if (!hospital || hospital.status !== 'approved') {
            return res.status(403).json({ message: "Hospital not verified" });
        }

        const { title, description, specialization, experienceRequired, salaryRange, location } = req.body;

        const job = new Job({
            title,
            description,
            specialization,
            experienceRequired,
            salaryRange,
            location,
            hospitalId: hospital._id,
        });

        const createdJob = await job.save();

        // Add job to hospital's jobsPosted array
        hospital.jobsPosted.push(createdJob._id);
        await hospital.save();

        res.status(201).json(createdJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Hospital)
export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.hospitalId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        const { title, description, specialization, experienceRequired, salaryRange, location } = req.body;

        job.title = title || job.title;
        job.description = description || job.description;
        job.specialization = specialization || job.specialization;
        job.experienceRequired = experienceRequired || job.experienceRequired;
        job.salaryRange = salaryRange || job.salaryRange;
        job.location = location || job.location;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Hospital)
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const userId = req.user.id || req.user._id;
        if (job.hospitalId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await job.deleteOne();

        // Remove from hospital's list
        const hospital = await Hospital.findById(userId);
        if (hospital) {
            hospital.jobsPosted = hospital.jobsPosted.filter(jId => jId.toString() !== req.params.id);
            await hospital.save();
        }

        res.json({ message: "Job deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply to a job
// @route   POST /api/apply/:jobId
// @access  Private (Doctor)
export const applyToJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const userId = req.user.id || req.user._id;

        console.log("User:", req.user);
        console.log("Job Apply:", jobId);

        const job = await Job.findById(jobId);
        const doctor = await Doctor.findById(userId);

        if (!job || !doctor) {
            return res.status(404).json({ message: "Not found" });
        }

        // prevent duplicate apply
        if (job.applicants.includes(doctor._id)) {
            return res.status(400).json({ message: "Already applied" });
        }

        job.applicants.push(doctor._id);
        doctor.appliedJobs.push(job._id);

        await job.save();
        await doctor.save();

        res.json({ message: "Applied successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

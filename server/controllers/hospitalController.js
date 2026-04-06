import Hospital from '../models/Hospital.js';
import Job from '../models/Job.js';

// @desc    Get hospital profile
// @route   GET /api/hospitals/profile
// @access  Private (Hospital)
export const getHospitalProfile = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user._id)
            .populate('jobsPosted')
            .select('-password');

        if (hospital) {
            res.json(hospital);
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get hospital dashboard stats
// @route   GET /api/hospitals/stats
// @access  Private (Hospital)
export const getDashboardStats = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user._id).select('-password');

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Fetch all jobs posted by this hospital
        const jobs = await Job.find({ hospitalId: req.user._id }).populate('applicants', 'name email specialization experience resume');

        const activeJobsCount = jobs.length;
        const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicants?.length || 0), 0);
        const profileViews = 124; // Placeholder for now or could be a field in DB

        res.json({
            profile: hospital,
            stats: {
                activeJobsCount,
                totalApplicants,
                profileViews
            },
            jobs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update hospital profile
// @route   PUT /api/hospitals/update
// @access  Private (Hospital)
export const updateHospitalProfile = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user._id);

        if (hospital) {
            hospital.hospitalName = req.body.hospitalName || hospital.hospitalName;
            hospital.location = req.body.location || hospital.location;
            hospital.description = req.body.description || hospital.description;
            hospital.email = req.body.email || hospital.email;

            const updatedHospital = await hospital.save();
            res.json({
                _id: updatedHospital._id,
                hospitalName: updatedHospital.hospitalName,
                email: updatedHospital.email,
                location: updatedHospital.location,
                description: updatedHospital.description,
                status: updatedHospital.status,
            });
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

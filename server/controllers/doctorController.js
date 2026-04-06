import Doctor from '../models/Doctor.js';

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private (Doctor)
export const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user._id)
            .populate('appliedJobs')
            .populate('savedJobs')
            .select('-password');

        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/update
// @access  Private (Doctor)
export const updateDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user._id);

        if (doctor) {
            doctor.name = req.body.name || doctor.name;
            doctor.specialization = req.body.specialization || doctor.specialization;
            doctor.experience = req.body.experience || doctor.experience;
            doctor.licenseNumber = req.body.licenseNumber || doctor.licenseNumber;
            doctor.email = req.body.email || doctor.email;

            if (req.body.skills) {
                doctor.skills = req.body.skills.split(',').map(skill => skill.trim());
            }

            if (req.file) {
                doctor.resume = `/uploads/${req.file.filename}`;
            }

            const updatedDoctor = await doctor.save();
            res.json({
                _id: updatedDoctor._id,
                name: updatedDoctor.name,
                email: updatedDoctor.email,
                specialization: updatedDoctor.specialization,
                experience: updatedDoctor.experience,
                licenseNumber: updatedDoctor.licenseNumber,
                resume: updatedDoctor.resume,
                skills: updatedDoctor.skills,
            });
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

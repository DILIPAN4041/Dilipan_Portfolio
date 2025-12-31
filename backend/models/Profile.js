import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    bio: {
        type: String,
        required: [true, 'Bio is required'],
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    avatarUrl: {
        type: String,
        default: 'https://via.placeholder.com/200'
    },
    resumeUrl: {
        type: String,
        default: ''
    },
    tagline: {
        type: String,
        maxlength: [200, 'Tagline cannot exceed 200 characters']
    },
    yearsOfExperience: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;

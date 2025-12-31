import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
    defaultTheme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark'
    },
    sectionsVisibility: {
        about: { type: Boolean, default: true },
        skills: { type: Boolean, default: true },
        projects: { type: Boolean, default: true },
        experience: { type: Boolean, default: true },
        blogs: { type: Boolean, default: true },
        funfacts: { type: Boolean, default: true },
        contact: { type: Boolean, default: true }
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    maintenanceMessage: {
        type: String,
        default: 'Site is under maintenance. Please check back later.'
    },
    siteTitle: {
        type: String,
        default: "Dilipan's Portfolio"
    },
    siteDescription: {
        type: String,
        default: 'Professional portfolio showcasing projects and skills'
    },
    // SEO Settings
    metaKeywords: [{
        type: String
    }],
    // Analytics
    googleAnalyticsId: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
siteSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;

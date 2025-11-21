import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  heroQuote: String,
  featuredCardQuote: String,
  contactEmail: String,
  locationText: String,
});

export default mongoose.model("SiteSettings", siteSettingsSchema);


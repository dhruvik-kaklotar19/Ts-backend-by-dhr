import mongoose from "mongoose";

const adsenseReportSchema = new mongoose.Schema(
    {
        // 🌐 Dimensions
        domain_name: { type: String, default: null },
        country_name: { type: String, default: null },
        date: { type: Date, default: null },

        // 💰 Earnings & Revenue Metrics
        estimated_earnings: { type: Number, default: 0 },
        total_earnings: { type: Number, default: 0 },
        page_views_rpm: { type: Number, default: 0 },
        impressions_rpm: { type: Number, default: 0 },
        matched_ad_requests_rpm: { type: Number, default: 0 },
        individual_ad_impressions_rpm: { type: Number, default: 0 },
        funnel_rpm: { type: Number, default: 0 },
        cost_per_click: { type: Number, default: 0 },

        // 📊 Traffic Metrics
        page_views: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        ad_requests: { type: Number, default: 0 },
        matched_ad_requests: { type: Number, default: 0 },
        total_impressions: { type: Number, default: 0 },
        individual_ad_impressions: { type: Number, default: 0 },
        funnel_requests: { type: Number, default: 0 },
        funnel_impressions: { type: Number, default: 0 },
        funnel_clicks: { type: Number, default: 0 },

        // 📈 Ratios & CTRs
        active_view_viewability: { type: Number, default: 0 },
        impressions_ctr: { type: Number, default: 0 },
        ad_requests_coverage: { type: Number, default: 0 },
        page_views_ctr: { type: Number, default: 0 },
        ad_requests_ctr: { type: Number, default: 0 },
        matched_ad_requests_ctr: { type: Number, default: 0 },
        individual_ad_impressions_ctr: { type: Number, default: 0 },
        active_view_measurability: { type: Number, default: 0 },

        // ⏱️ Timings & Misc
        active_view_time: { type: Number, default: 0 }, // milliseconds
        ads_per_impression: { type: Number, default: 0 },

        // 🔐 System fields
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey: false
    }
);
adsenseReportSchema.index({ date: -1 });
adsenseReportSchema.index({ domain_name: 1, country_name: 1 });


export const adsenseReportModel = mongoose.model("adsenseReport", adsenseReportSchema);

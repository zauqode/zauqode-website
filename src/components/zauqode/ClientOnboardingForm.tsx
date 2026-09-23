import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Check,
  Send,
  Loader2,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";
import {
  sendToGoogleSheet,
  DEFAULT_GOOGLE_SHEET_URL,
} from "../../lib/googleSheetIntegration";

const WHATSAPP_RAW = "918946077234";
const STORAGE_KEY = "zauqode_simple_brief_v2";
const SHEET_STORAGE_KEY = "zauqode_custom_sheet_url_v1";

interface FormData {
  businessName: string;
  businessNature: string;
  businessServices: string;
  aboutBusiness: string;
  phone: string;
  email: string;
  logoDriveUrl: string;
  domainName: string;
  domainStatus: string;
  websiteTypes: string[];
  targetLaunch: string;
  agreedToTerms: boolean;
}

const initialFormData: FormData = {
  businessName: "",
  businessNature: "",
  businessServices: "",
  aboutBusiness: "",
  phone: "",
  email: "",
  logoDriveUrl: "",
  domainName: "",
  domainStatus: "undecided",
  websiteTypes: ["Business Website", "Portfolio / Personal Brand"],
  targetLaunch: "within 2 months",
  agreedToTerms: true,
};

const AVAILABLE_WEBSITE_TYPES = [
  "Business Website",
  "Portfolio / Personal Brand",
  "Service Website",
  "Product / Sales Website",
  "Digital Invitation / Event",
  "Other",
];

const DOMAIN_STATUS_OPTIONS = [
  "undecided",
  "already purchased",
  "need help choosing / buying",
];

const TARGET_LAUNCH_OPTIONS = [
  "within 2 months",
  "within 1 month",
  "urgent (within 1-2 weeks)",
  "flexible / 3+ months",
];

export function ClientOnboardingForm() {
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...initialFormData,
            ...parsed,
            websiteTypes: Array.isArray(parsed.websiteTypes)
              ? parsed.websiteTypes
              : typeof parsed.websiteType === "string"
              ? [parsed.websiteType]
              : initialFormData.websiteTypes,
            domainStatus: parsed.domainStatus || initialFormData.domainStatus,
            targetLaunch: parsed.targetLaunch || initialFormData.targetLaunch,
          };
        }
      } catch (e) {}
    }
    return initialFormData;
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [googleSheetUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(SHEET_STORAGE_KEY) || DEFAULT_GOOGLE_SHEET_URL;
    }
    return DEFAULT_GOOGLE_SHEET_URL;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save form draft
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {}
  }, [formData]);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleWebsiteType = (type: string) => {
    setFormData((prev) => {
      const exists = prev.websiteTypes.includes(type);
      const updated = exists
        ? prev.websiteTypes.filter((t) => t !== type)
        : [...prev.websiteTypes, type];
      return { ...prev, websiteTypes: updated.length ? updated : [type] };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Compile formatted WhatsApp message
  const compileWhatsAppSummary = () => {
    const domainText = formData.domainName.trim()
      ? `${formData.domainName} (${formData.domainStatus})`
      : `brand.com (${formData.domainStatus})`;
    const typesText = formData.websiteTypes.length > 0
      ? formData.websiteTypes.join(", ")
      : "Business Website, Portfolio / Personal Brand";

    return `✨ *ZAUQODE — CLIENT PROJECT BRIEF* ✨
━━━━━━━━━━━━━━━━━━━━
🏢 *Business Name:* ${formData.businessName}
💼 *Nature / Type:* ${formData.businessNature || "N/A"}
🛠️ *Services:* ${formData.businessServices || "N/A"}
📖 *About Business:* ${formData.aboutBusiness || "N/A"}
📞 *Phone / WhatsApp:* ${formData.phone}
✉️ *Email:* ${formData.email}
🎨 *Logo / Assets:* ${formData.logoDriveUrl || (logoFile ? `File: ${logoFile.name}` : "To be shared")}

🌐 *5. WEBSITE SPECIFICATIONS*
• *Desired Domain:* ${domainText}
• *Website Types:* ${typesText}
• *Target Launch:* ${formData.targetLaunch}

⚖️ *Terms & Conditions:* Agreed & Confirmed ✓ (No Refund after project delivery)
━━━━━━━━━━━━━━━━━━━━`;
  };

  // Single primary submit: saves to Google Sheet & opens WhatsApp
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName.trim()) {
      alert("Please enter your Business Name.");
      return;
    }
    if (!formData.phone.trim()) {
      alert("Please enter your Phone number.");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter your Email address.");
      return;
    }
    if (!formData.agreedToTerms) {
      alert("Please check the box to agree to ZAUQODE's Terms & Studio Policies.");
      return;
    }

    setIsSubmitting(true);

    // 1. Send to Google Sheet if URL is configured
    if (googleSheetUrl && googleSheetUrl.trim()) {
      try {
        await sendToGoogleSheet(
          {
            ...formData,
            websiteTypes: formData.websiteTypes,
            targetLaunchDate: formData.targetLaunch,
          },
          googleSheetUrl
        );
      } catch (err) {
        console.error("Google sheet sync error", err);
      }
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    // 2. Open WhatsApp with formatted brief
    const text = encodeURIComponent(compileWhatsAppSummary());
    const waUrl = `https://wa.me/${WHATSAPP_RAW}?text=${text}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#0D2626] font-sans antialiased py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Simple Brand Header */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-200/80">
          <div className="flex items-center gap-3.5">
            <img src={zauqodeLogo} alt="ZAUQODE" className="w-9 h-9 rounded-lg object-contain" />
            <div>
              <span className="font-editorial text-base font-bold tracking-[0.2em] uppercase text-[#0D2626]">
                ZAUQODE
              </span>
              <span className="block text-xs text-gray-500 font-medium">
                Client Project Intake
              </span>
            </div>
          </div>
          <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50 hidden sm:inline-block">
            Approved Client Brief
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-gray-200/80">
          <div className="mb-8 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-[#0D2626] tracking-tight">
              Business Information for Website Creation
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Please provide the basic details below to kickstart your website design.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 2-Column Balanced Grid on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              {/* Left Column: Business Profile */}
              <div className="space-y-5">
                <div className="border-b border-gray-100 pb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#0D4747]">
                    1. Business Profile
                  </h2>
                </div>

                {/* 1. Business Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    placeholder="Your official business or brand name"
                    className="w-full px-4 py-3 bg-[#F9FBFA] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all"
                  />
                </div>

                {/* 2. Nature of Business & Services */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nature / Type of Business <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessNature}
                    onChange={(e) => updateField("businessNature", e.target.value)}
                    placeholder="e.g. Interior Design, Dental Clinic, Specialty Cafe"
                    className="w-full px-4 py-3 bg-[#F9FBFA] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Business Services / Activity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessServices}
                    onChange={(e) => updateField("businessServices", e.target.value)}
                    placeholder="e.g. Consultations, Turnkey Execution, Online Sales"
                    className="w-full px-4 py-3 bg-[#F9FBFA] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all"
                  />
                </div>

                {/* 3. About the Business */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    About the Business <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.aboutBusiness}
                    onChange={(e) => updateField("aboutBusiness", e.target.value)}
                    placeholder="Briefly describe what your business does, your story, or what sets you apart from competitors..."
                    className="w-full p-3.5 bg-[#F9FBFA] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all resize-y"
                  />
                </div>
              </div>

              {/* Right Column: Contact & Website Specs */}
              {/* Right Column: Contact & Website Specifications */}
              <div className="space-y-6">
                {/* 2. Contact & Assets */}
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#0D4747]">
                      2. Contact & Brand Assets
                    </h2>
                  </div>

                  {/* 4. Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Mobile / Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-[#F9FBFA] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all"
                    />
                  </div>

                  {/* 5. Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="hello@yourbrand.com"
                      className="w-full px-4 py-3 bg-[#F9FBFA] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all"
                    />
                  </div>

                  {/* 6. Logo */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Business Logo / Assets Link
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/svg+xml,application/pdf"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-3 rounded-xl border border-dashed border-gray-300 hover:border-[#0D9488] text-xs font-medium text-gray-700 bg-[#F9FBFA] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#0D9488]" />
                        <span className="truncate">{logoFile ? `✓ ${logoFile.name}` : "Upload Logo File"}</span>
                      </button>

                      <input
                        type="url"
                        value={formData.logoDriveUrl}
                        onChange={(e) => updateField("logoDriveUrl", e.target.value)}
                        placeholder="Or Google Drive link"
                        className="w-full px-4 py-3 bg-[#F9FBFA] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Website Specifications */}
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div className="border-b border-gray-100 pb-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#0D4747]">
                      3. Website Specifications
                    </h2>
                  </div>

                  {/* Desired Domain */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Desired Domain
                      </label>
                      <span className="text-[11px] text-gray-500 font-medium">
                        Status: <span className="text-[#0D4747] font-semibold capitalize">{formData.domainStatus}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={formData.domainName}
                          onChange={(e) => updateField("domainName", e.target.value)}
                          placeholder="e.g. brand.com (or leave undecided)"
                          className="w-full px-4 py-2.5 bg-[#F9FBFA] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <select
                          value={formData.domainStatus}
                          onChange={(e) => updateField("domainStatus", e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#F9FBFA] rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all cursor-pointer capitalize"
                        >
                          {DOMAIN_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Website Types (Multi-select) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Website Types <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-gray-400">
                        (Select all that apply)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_WEBSITE_TYPES.map((type) => {
                        const isSelected = formData.websiteTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleWebsiteType(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#0D4747] text-white border-[#0D4747] shadow-xs"
                                : "bg-[#F9FBFA] text-gray-700 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target Launch */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Target Launch
                    </label>
                    <select
                      value={formData.targetLaunch}
                      onChange={(e) => updateField("targetLaunch", e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F9FBFA] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all cursor-pointer capitalize"
                    >
                      {TARGET_LAUNCH_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions Accordion */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-[#F9FBFA]">
                <button
                  type="button"
                  onClick={() => setTermsOpen(!termsOpen)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0D4747] hover:bg-gray-100/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    📄 Terms & Conditions (Click to {termsOpen ? "close" : "view details"})
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      termsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {termsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-gray-200/70"
                    >
                      <div className="p-4 text-xs text-gray-600 bg-white leading-relaxed">
                        <ul className="space-y-2 list-disc pl-4">
                          <li>
                            <strong className="text-[#0D2626]">Kickoff Deposit:</strong> A 50% advance deposit is required to begin the project. The remaining 50% balance is due upon project completion before live domain handover.
                          </li>
                          <li>
                            <strong className="text-[#0D2626]">Revision Scope:</strong> Standard revision rounds are included to refine the design, typography, layout, and content.
                          </li>
                          <li>
                            <strong className="text-[#0D2626]">Content & Assets:</strong> The client is responsible for providing all necessary brand copy, logos, and images in a timely manner.
                          </li>
                          <li>
                            <strong className="text-[#0D2626]">Domain & Hosting:</strong> Domain registration and hosting accounts are owned directly by the client (we provide complete setup assistance).
                          </li>
                          <li className="text-red-700 font-medium">
                            <strong className="text-red-800">Strict No-Refund Policy:</strong> No refunds will be provided once the project is delivered and approved.
                          </li>
                          <li>
                            <strong className="text-[#0D2626]">Post-Launch Support:</strong> Includes 14 days of free bug-fixing support after website handover.
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Agreement Checkbox */}
              <label
                onClick={() => updateField("agreedToTerms", !formData.agreedToTerms)}
                className="flex items-start gap-3 cursor-pointer select-none py-1"
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors flex-shrink-0 ${
                    formData.agreedToTerms ? "bg-[#0D4747] text-white" : "border border-gray-300 bg-white"
                  }`}
                >
                  {formData.agreedToTerms && <Check className="w-3 h-3" />}
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  <span>
                    I confirm that I have read and agree to ZAUQODE's Terms & Conditions (including the <strong>No Refund after project delivery</strong> policy). <span className="text-red-500">*</span>
                  </span>
                </div>
              </label>
            </div>

            {/* Submit Button Section */}
            <div className="pt-2 max-w-md mx-auto text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 rounded-xl bg-[#0D4747] hover:bg-[#0A3838] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Details...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#2DD4BF]" />
                    <span>Submit Details</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Success Alert Modal */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-100 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0D2626]">Details Submitted!</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Thank you, <span className="font-semibold text-[#0D4747]">{formData.businessName}</span>. Your project brief has been recorded and WhatsApp has been opened to connect with our studio.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="w-full py-2.5 rounded-xl bg-[#0D4747] text-white text-xs font-semibold hover:bg-[#0A3838] transition-colors"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Save, Store, Mail, Phone, MapPin, Globe,
  Bell, Shield, CreditCard, Truck, RefreshCw,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import { useDialog } from "@/components/elements";
import apiClient from "@/lib/api/client";
import Loading from "@/components/elements/loading";

// ─── Setting keys grouped by tab ──────────────────────────────────────────────
const TABS = [
  { id: "general",    label: "General",         Icon: Store      },
  { id: "contact",    label: "Contact",          Icon: Mail       },
  { id: "shipping",   label: "Shipping",         Icon: Truck      },
  { id: "payment",    label: "Payment",          Icon: CreditCard },
  { id: "notifications", label: "Notifications", Icon: Bell       },
  { id: "security",   label: "Security",         Icon: Shield     },
] as const;

type TabId = typeof TABS[number]["id"];

type Settings = Record<string, string>;

// Keys that belong to each tab — drives which fields we render
const TAB_FIELDS: Record<TabId, { key: string; label: string; type: "text" | "email" | "tel" | "url" | "textarea" | "toggle"; placeholder?: string }[]> = {
  general: [
    { key: "store_name",        label: "Store Name",        type: "text",     placeholder: "PixieLoops"          },
    { key: "store_tagline",     label: "Tagline",           type: "text",     placeholder: "Handcrafted with love"},
    { key: "store_description", label: "Description",       type: "textarea", placeholder: "Describe your store…" },
    { key: "store_currency",    label: "Currency",          type: "text",     placeholder: "INR"                  },
    { key: "store_timezone",    label: "Timezone",          type: "text",     placeholder: "Asia/Kolkata"         },
  ],
  contact: [
    { key: "contact_email",   label: "Email",          type: "email", placeholder: "contact@pixieloops.com" },
    { key: "contact_phone",   label: "Phone",          type: "tel",   placeholder: "+91 98765 43210"        },
    { key: "contact_address", label: "Address",        type: "textarea", placeholder: "Full store address…"  },
    { key: "store_website",   label: "Website URL",    type: "url",   placeholder: "https://pixieloops.com" },
  ],
  shipping: [
    { key: "shipping_free_threshold", label: "Free Shipping Above (₹)", type: "text", placeholder: "500"  },
    { key: "shipping_flat_rate",      label: "Flat Rate (₹)",           type: "text", placeholder: "60"   },
    { key: "shipping_estimated_days", label: "Estimated Days",          type: "text", placeholder: "3–5"  },
    { key: "shipping_note",           label: "Shipping Note",           type: "textarea", placeholder: "Any shipping restrictions or notes…" },
  ],
  payment: [
    { key: "razorpay_key_id",     label: "Razorpay Key ID",     type: "text", placeholder: "rzp_live_…"    },
    { key: "razorpay_key_secret", label: "Razorpay Secret",     type: "text", placeholder: "●●●●●●●●"      },
    { key: "upi_id",              label: "UPI ID",              type: "text", placeholder: "store@upi"     },
    { key: "cod_enabled",         label: "Cash on Delivery",    type: "toggle"                              },
  ],
  notifications: [
    { key: "notify_new_order",   label: "New Order Email",    type: "toggle" },
    { key: "notify_low_stock",   label: "Low Stock Alert",    type: "toggle" },
    { key: "notify_new_review",  label: "New Review Alert",   type: "toggle" },
    { key: "notify_email_to",    label: "Send Alerts To",     type: "email", placeholder: "admin@pixieloops.com" },
  ],
  security: [
    { key: "admin_2fa_enabled",      label: "Two-Factor Auth",         type: "toggle" },
    { key: "session_timeout_minutes",label: "Session Timeout (mins)",  type: "text",  placeholder: "60" },
    { key: "max_login_attempts",     label: "Max Login Attempts",      type: "text",  placeholder: "5"  },
  ],
};

// ─── Toggle component ─────────────────────────────────────────────────────────
// Uses a raw <button> intentionally: role="switch" + aria-checked are ARIA
// switch semantics that our Button component doesn't support. Wrapping in
// Button would render a generic button and break screen-reader announcements.
function Toggle({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const on = value === "1" || value === "true";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(on ? "0" : "1")}
      className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${on ? "bg-purple-600" : "bg-gray-300"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const dialog = useDialog();

  const [settings, setSettings] = useState<Settings>({});
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ settings: Settings }>("/admin/settings");
      setSettings(data.settings ?? {});
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to load settings.", "Error");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    const confirmed = await dialog.show({
      title:        "Save Settings",
      message:      "Save all changes? Updated settings will apply to your store immediately.",
      variant:      "info",
      confirmLabel: "Save",
      cancelLabel:  "Review",
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      await apiClient.put("/admin/settings", { settings });
      await dialog.success("Settings saved successfully.", "Saved");
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to save settings.", "Error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving) return <Loading />;

  const fields = TAB_FIELDS[activeTab];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">Settings</Heading>
          <Text variant="small" className="text-gray-600 mt-1">Manage your store settings and preferences</Text>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={fetchSettings} aria-label="Refresh settings" className="p-2.5 border border-gray-200">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="primary" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar */}
        <Card variant="bordered" className="lg:col-span-1 p-3 h-fit">
          <nav aria-label="Settings sections">
            <div className="space-y-1">
              {TABS.map(({ id, label, Icon }) => (
                <Button
                  key={id}
                  variant="ghost"
                  onClick={() => setActiveTab(id)}
                  aria-current={activeTab === id ? "page" : undefined}
                  className={`w-full justify-start gap-3 px-3 py-2.5 text-sm ${
                    activeTab === id
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </Button>
              ))}
            </div>
          </nav>
        </Card>

        {/* Form */}
        <Card variant="elevated" className="lg:col-span-3 p-6">
          <div className="flex items-center gap-3 mb-6">
            {(() => { const tab = TABS.find((t) => t.id === activeTab)!; return <tab.Icon className="h-5 w-5 text-purple-600" />; })()}
            <Heading level={4} className="text-gray-900">
              {TABS.find((t) => t.id === activeTab)?.label} Settings
            </Heading>
          </div>

          <div className="space-y-5">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label htmlFor={`setting-${key}`} className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>

                {type === "toggle" ? (
                  <div className="flex items-center gap-3">
                    <Toggle
                      label={label}
                      value={settings[key] ?? "0"}
                      onChange={(v) => set(key, v)}
                    />
                    <Text variant="small" className="text-gray-500">
                      {settings[key] === "1" || settings[key] === "true" ? "Enabled" : "Disabled"}
                    </Text>
                  </div>
                ) : type === "textarea" ? (
                  <textarea
                    id={`setting-${key}`}
                    rows={4}
                    value={settings[key] ?? ""}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                  />
                ) : (
                  <input
                    id={`setting-${key}`}
                    type={type}
                    value={settings[key] ?? ""}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Tab-level save */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
            <Button variant="primary" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
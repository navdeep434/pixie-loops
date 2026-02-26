"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Trash2, Upload, X, Eye, EyeOff, ImageIcon } from "lucide-react";
import { useDialog } from "@/components/elements";
import apiClient from "@/lib/api/client";
import { Button, Card, Heading, Text } from "@/components/elements";
import { API_URL } from "@/lib/api/config";
import Loading from "@/components/elements/loading";

type ContentForm = {
  title: string;
  body: string;
  status: boolean;
};

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const id     = params?.id as string;
  const dialog = useDialog();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm]         = useState<ContentForm>({ title: "", body: "", status: false });
  const [key, setKey]           = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [preview, setPreview]   = useState(false);

  useEffect(() => { fetchContent(); }, [id]);

  const fetchContent = async () => {
    try {
      const data = await apiClient.get<any>(`/admin/contents/${id}`);
      const c = data.content ?? data;
      setKey(c.key ?? "");
      setImageUrl(c.image ?? null);
      setForm({
        title:  c.title  ?? "",
        body:   c.body   ?? "",
        status: c.status ?? false,
      });
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to load content.", "Load Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const confirmed = await dialog.show({
      title:        "Save Changes",
      message:      <>Save changes to <strong>"{form.title || key}"</strong>?{" "}
                    {form.status ? "This will update the published content immediately." : "Changes will be saved as a draft."}</>,
      variant:      "info",
      confirmLabel: "Save",
      cancelLabel:  "Keep Editing",
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      // If a new image is selected, use FormData (multipart); otherwise JSON
      if (imageFile) {
        const xsrf = document.cookie.split("; ").find((c) => c.startsWith("XSRF-TOKEN="))?.split("=")[1];
        const fd = new FormData();
        fd.append("title",  form.title);
        fd.append("body",   form.body);
        fd.append("status", form.status ? "1" : "0");
        fd.append("image",  imageFile);
        const res = await fetch(`${API_URL}/admin/contents/${id}`, {
          method: "POST", // Laravel FormData PUT workaround
          credentials: "include",
          headers: {
            ...(xsrf ? { "X-XSRF-TOKEN": decodeURIComponent(xsrf) } : {}),
            Accept: "application/json",
          },
          body: fd,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to save");
        }
      } else {
        await apiClient.put(`/admin/contents/${id}`, {
          title:  form.title  || null,
          body:   form.body   || null,
          status: form.status,
        });
      }
      await dialog.success(`"${form.title || key}" saved successfully.`, "Saved");
      router.push("/admin/content");
    } catch (err: any) {
      setSaving(false);
      await dialog.warn(err.message || "Failed to save content.", "Error");
    }
  };

  const handleDelete = async () => {
    const confirmed = await dialog.danger(
      <>Permanently delete <strong>"{form.title || key}"</strong>? This cannot be undone.</>,
      "Delete Content"
    );
    if (!confirmed) return;
    setSaving(true);
    try {
      await apiClient.delete(`/admin/contents/${id}`);
      await dialog.success("Content deleted.", "Deleted");
      router.push("/admin/content");
    } catch (err: any) {
      setSaving(false);
      await dialog.warn(err.message || "Failed to delete content.", "Error");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setImageUrl(null);
  };

  const displayImage = imagePreview ?? imageUrl;

  if (loading || saving) return <Loading />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} aria-label="Go back" className="p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <Heading level={2} className="text-gray-900">Edit Content</Heading>
            <Text variant="small" className="text-gray-500 mt-0.5 font-mono">{key}</Text>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => setPreview((p) => !p)}
            className="gap-2 border border-gray-200"
            aria-label={preview ? "Exit preview" : "Preview content"}
          >
            {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button variant="ghost" onClick={handleDelete} className="gap-2 border border-red-200 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <Button variant="primary" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: editor ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {preview ? (
            /* ── Preview panel ─────────────────────────────── */
            <Card variant="elevated" className="p-6 space-y-4">
              <Heading level={4} className="text-gray-900 mb-2">Preview</Heading>
              {displayImage && (
                <img src={displayImage} alt="Content" className="w-full rounded-xl object-cover max-h-64" />
              )}
              <Heading level={3} className="text-gray-900">{form.title || <span className="text-gray-300">No title</span>}</Heading>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {form.body || <span className="text-gray-300">No body content</span>}
              </div>
            </Card>
          ) : (
            /* ── Edit form ──────────────────────────────────── */
            <>
              <Card variant="elevated" className="p-6 space-y-5">
                <Heading level={4} className="text-gray-900">Content Details</Heading>

                {/* Key (read-only) */}
                <div>
                  <label htmlFor="content-key" className="block text-sm font-medium text-gray-700 mb-2">
                    Key <span className="text-gray-400 font-normal">(read-only)</span>
                  </label>
                  <input
                    id="content-key"
                    type="text"
                    value={key}
                    readOnly
                    aria-readonly="true"
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 font-mono text-sm cursor-not-allowed"
                  />
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="content-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    id="content-title"
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. About Us — Our Story"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Body */}
                <div>
                  <label htmlFor="content-body" className="block text-sm font-medium text-gray-700 mb-2">
                    Body
                  </label>
                  <textarea
                    id="content-body"
                    rows={10}
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    placeholder="Write your content here..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y font-mono text-sm"
                  />
                  <Text variant="small" className="text-gray-400 mt-1">{form.body.length} characters</Text>
                </div>
              </Card>

              {/* Image */}
              <Card variant="elevated" className="p-6">
                <Heading level={4} className="text-gray-900 mb-1">Image</Heading>
                <Text variant="small" className="text-gray-500 mb-4">Optional. Replaces the existing image on save.</Text>

                {displayImage ? (
                  <div className="relative rounded-xl overflow-hidden group">
                    <img src={displayImage} alt="Content" className="w-full max-h-56 object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <Button
                        variant="ghost"
                        onClick={removeImage}
                        aria-label="Remove image"
                        className="opacity-0 group-hover:opacity-100 bg-white/90 text-red-600 hover:bg-white gap-1.5 transition-opacity"
                      >
                        <X className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                    <ImageIcon className="h-10 w-10 text-gray-300 mb-3" />
                    <Text className="font-medium text-gray-600">Click to upload an image</Text>
                    <Text variant="small" className="text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</Text>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} aria-label="Upload content image" />
                  </label>
                )}
              </Card>
            </>
          )}
        </div>

        {/* ── Right sidebar ────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Status */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">Status</Heading>

            {/* Toggle */}
            <Button
              variant="ghost"
              onClick={() => setForm({ ...form, status: !form.status })}
              aria-pressed={form.status}
              aria-label="Toggle published status"
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 h-auto transition-all ${
                form.status
                  ? "border-green-300 bg-green-50 hover:bg-green-50"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${form.status ? "bg-green-500" : "bg-gray-400"}`}>
                  {form.status ? <Eye className="h-4 w-4 text-white" /> : <EyeOff className="h-4 w-4 text-white" />}
                </div>
                <div className="text-left">
                  <Text className={`font-semibold ${form.status ? "text-green-700" : "text-gray-700"}`}>
                    {form.status ? "Published" : "Draft"}
                  </Text>
                  <Text variant="small" className="text-gray-500">
                    {form.status ? "Visible on storefront" : "Hidden from visitors"}
                  </Text>
                </div>
              </div>
              {/* Pill toggle */}
              <div className={`relative w-11 h-6 rounded-full transition-colors ${form.status ? "bg-green-500" : "bg-gray-300"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.status ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </Button>
          </Card>

          {/* Meta */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">Info</Heading>
            <div className="space-y-3">
              <div>
                <Text variant="small" className="text-gray-500 uppercase tracking-wide font-medium">Key</Text>
                <Text className="text-gray-900 font-mono text-sm mt-0.5">{key}</Text>
              </div>
              {displayImage && (
                <div>
                  <Text variant="small" className="text-gray-500 uppercase tracking-wide font-medium">Image</Text>
                  <Text variant="small" className="text-gray-400 mt-0.5 truncate">
                    {imageFile ? imageFile.name : "Existing image"}
                  </Text>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">Actions</Heading>
            <div className="space-y-2">
              <Button variant="primary" onClick={handleSave} className="w-full justify-center gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPreview((p) => !p)}
                className="w-full justify-center gap-2 border border-gray-200"
              >
                {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {preview ? "Back to Edit" : "Preview"}
              </Button>
              <Button variant="ghost" onClick={handleDelete} className="w-full justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
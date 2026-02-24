"use client";

import type { FirmProfile, Advocate } from "@/lib/types/firm";

interface FirmProfileFormProps {
  profile: FirmProfile;
  onChange: (profile: FirmProfile) => void;
}

export default function FirmProfileForm({ profile, onChange }: FirmProfileFormProps) {
  const update = (field: keyof FirmProfile, value: string) => {
    onChange({ ...profile, [field]: value });
  };

  const updateSenior = (field: keyof Advocate, value: string) => {
    onChange({
      ...profile,
      seniorAdvocate: { ...profile.seniorAdvocate, [field]: value },
    });
  };

  const updateAssociate = (index: number, field: keyof Advocate, value: string) => {
    const updated = [...profile.associates];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...profile, associates: updated });
  };

  const addAssociate = () => {
    onChange({
      ...profile,
      associates: [...profile.associates, { name: "", enrollment: "" }],
    });
  };

  const removeAssociate = (index: number) => {
    onChange({
      ...profile,
      associates: profile.associates.filter((_, i) => i !== index),
    });
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#075e54]/30 focus:border-[#075e54]";

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Firm Name</label>
        <input
          type="text"
          value={profile.firmName}
          onChange={(e) => update("firmName", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
        <input
          type="text"
          value={profile.tagline}
          onChange={(e) => update("tagline", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Senior Advocate</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={profile.seniorAdvocate.name}
              onChange={(e) => updateSenior("name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Enrollment</label>
            <input
              type="text"
              value={profile.seniorAdvocate.enrollment}
              onChange={(e) => updateSenior("enrollment", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Associates</h3>
          <button
            onClick={addAssociate}
            className="text-xs font-medium text-[#075e54] hover:underline"
          >
            + Add Associate
          </button>
        </div>
        {profile.associates.map((assoc, i) => (
          <div key={i} className="flex items-start gap-2 mb-3">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={assoc.name}
                onChange={(e) => updateAssociate(i, "name", e.target.value)}
                placeholder="Name"
                className={inputClass}
              />
              <input
                type="text"
                value={assoc.enrollment}
                onChange={(e) => updateAssociate(i, "enrollment", e.target.value)}
                placeholder="Enrollment"
                className={inputClass}
              />
            </div>
            <button
              onClick={() => removeAssociate(i)}
              className="mt-2.5 p-1 text-red-400 hover:text-red-600"
              title="Remove"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Contact Details</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Address</label>
            <textarea
              value={profile.address}
              onChange={(e) => update("address", e.target.value)}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                type="text"
                value={profile.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

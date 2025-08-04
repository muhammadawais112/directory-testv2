import { useEffect, useState } from "react";
import { useAgencyInfo } from "../../../../context/agency";
import { useAppServices } from "../../../../hook/services";

function BusinessHours({ formData, handleRefresh, features }) {
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;
  const AppService = useAppServices();
  const [success, setSuccess] = useState("");
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [businessHours, setBusinessHours] = useState([]);
  const fieldsdisabled = features.find(
    (feature) =>
      feature.name == "Business Hour Configurations" && feature.value == true
  )
    ? true
    : false;
  // Initialize business hours from formData or default values
  useEffect(() => {
    if (formData.business_hours && formData.business_hours.length > 0) {
      const initializedHours = days.map((day) => {
        const existingDay = formData.business_hours.find(
          (bh) => bh.day === day
        );
        return {
          day,
          start_time: existingDay?.start_time || "",
          end_time: existingDay?.end_time || "",
        };
      });
      setBusinessHours(initializedHours);
    } else {
      setBusinessHours(
        days.map((day) => ({ day, start_time: "", end_time: "" }))
      );
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      _id: formData.id,
      business_hours: businessHours,
    };
    console.log(payload, "payload");
    const { response } = await AppService.accounts.update({ payload });
    if (response) {
      handleRefresh();
      setSuccess("Business hours updated successfully!");
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setBusinessHours((prevData) =>
      prevData.map((entry, i) =>
        i === index ? { ...entry, [name]: value } : entry
      )
    );
    setSuccess("");
  };

  return (
    <div className="p-6">
      {success && (
        <div className="mb-4 p-2 text-green-700 bg-green-100 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {businessHours.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 items-center bg-white p-4 rounded-lg shadow-md"
            >
              <label className="font-medium">{entry.day}</label>
              <input
                type="time"
                disabled={fieldsdisabled}
                name="start_time"
                value={entry.start_time}
                onChange={(e) => handleChange(e, index)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="time"
                disabled={fieldsdisabled}
                name="end_time"
                value={entry.end_time}
                onChange={(e) => handleChange(e, index)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
           style={{
            background: theme_content?.general?.button_bg || "#EF4444",
            color: theme_content?.general?.button_text || "#fff",
          }}
            disabled={fieldsdisabled}
            type="submit"
            className="px-6 py-2 rounded-md"
          >
            Update Business Hours
          </button>
        </div>
      </form>
    </div>
  );
}

export default BusinessHours;

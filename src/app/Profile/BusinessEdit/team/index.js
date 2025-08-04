import { useState } from "react";
import { useAgencyInfo } from "../../../../context/agency";
import { useAppServices, useUploadImage } from "../../../../hook/services";
import Image from "next/image";
function TeamView({ data, handleRefresh }) {
  const [agency] = useAgencyInfo();
  const theme_content = agency?.theme_id?.theme_data;
  const AppService = useAppServices();
  const [isEditing, setIsEditing] = useState(false); // Track editing mode
  const [editingIndex, setEditingIndex] = useState(null); // Track the index of the item being edited
  const uploadImage = useUploadImage();
  const [currentFormData, setCurrentFormData] = useState({
    image: "",
    name: "",
    designation: "",
    description: "",
  });


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const image = e.target.image.files[0];
    let image_url = currentFormData?.image || ""; // Preserve existing image URL

    if (image) {
      await uploadImage({
        file: image,
        desiredPath: "team",
      }).then(({ response }) => {
        image_url = response.data;
      });
    }

    const newTeam = {
      image: image_url,
      name: currentFormData.name,
      designation: currentFormData.designation,
      description: currentFormData.description,
    };

    let updatedTeam;
    if (isEditing) {
      // Update existing record
      updatedTeam = data?.team?.map((item, index) =>
        index === editingIndex ? newTeam : item
      );
    } else {
      // Add new record
      updatedTeam = Array.isArray(data.team)
        ? [...data?.team, newTeam]
        : [newTeam];
    }

    const payload = {
      _id: data?.id,
      team: updatedTeam,
    };
    const { response } = await AppService.accounts.update({ payload });
    if (response) {
      handleRefresh();
      resetForm();
    }
  };

  const handleEdit = (team, index) => {
    setCurrentFormData(team);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const deleteTeam = async (team) => {
    const payload = {
      _id: data.id,
      team: data.team.filter((item) => item !== team),
    };
    const { response } = await AppService.accounts.update({ payload });
    if (response) {
      handleRefresh();
    }
  };

  const resetForm = () => {
    setCurrentFormData({
      image: "",
      name: "",
      designation: "",
      description: "",
    });
    setIsEditing(false);
    setEditingIndex(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <div className="w-full md:w-1/3 bg-white rounded-lg p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Image</label>
            <input
              type="file"
              className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-medium
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
              name="image"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="name"
              onChange={handleChange}
              defaultValue={currentFormData.name}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Designation
            </label>
            <input
              type="text"
              placeholder="Designation"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="designation"
              onChange={handleChange}
              defaultValue={currentFormData.designation}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              placeholder="Description"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="description"
              onChange={handleChange}
              defaultValue={currentFormData.description}
             />
          </div>
          <button
            style={{
              background: theme_content?.general?.button_bg || "#EF4444",
              color: theme_content?.general?.button_text || "#fff",
            }}
            type="submit"
            className="px-4 py-2 rounded-lg "
          >
            Add Team
          </button>
        </form>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.team?.map((team, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 text-center flex flex-col justify-between"
          >
            <div>
              <div className="w-24 h-24 mx-auto mb-4">
                <Image
                  src={
                    team?.image ||
                    "https://www.w3schools.com/howto/img_avatar.png"
                  }
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold">{team.name}</h2>
              <p className="text-blue-500 font-medium">{team.designation}</p>
              <p className="text-gray-600 mt-2">{team.description}</p>
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => handleEdit(team, index)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => deleteTeam(team)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamView;

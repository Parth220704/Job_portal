import { useState, useEffect } from "react";
import {
  getMyCompany,
  createCompany,
  updateCompany,
} from "../../../api/company";

import {
  HiOutlineBuildingOffice,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlinePhoto,
  HiOutlineTrash,
} from "react-icons/hi2";

import { FaLinkedin, FaTwitter } from "react-icons/fa";
import toast from "react-hot-toast";


const CompanyProfile = () => {

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const [logoPreview, setLogoPreview] = useState(null);

  const [formData, setFormData] = useState({

    companyName: "",
    description: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    location: "",
    website: "",
    email: "",
    phone: "",
    linkedin: "",
    twitter: "",
    logoUrl: "",
    logoFile: null,

  });


  /* Load company */
  useEffect(() => {
    loadCompany();
  }, []);


  const loadCompany = async () => {

    try {

      const data = await getMyCompany();

      if (data) {

        setCompany(data);

        setFormData({
          ...data,
          logoFile: null,
        });

        setLogoPreview(data.logoUrl);

      }

    } catch {}

    setLoading(false);

  };


  /* Handle change */
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "logoUrl") {
      setLogoPreview(value);
    }

  };


  /* Upload logo */
  const handleLogoUpload = (e) => {

    const file = e.target.files[0];

    if (file) {

      setFormData({
        ...formData,
        logoFile: file,
        logoUrl: "",
      });

      setLogoPreview(URL.createObjectURL(file));

    }

  };


  /* Remove logo */
  const removeLogo = () => {

    setFormData({
      ...formData,
      logoFile: null,
      logoUrl: "",
    });

    setLogoPreview(null);

  };


  /* Submit */
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (company) {

        const updated = await updateCompany(formData);

        setCompany(updated);
        toast.success("Company updated successfully");

      } else {

        const created = await createCompany(formData);

        setCompany(created);
        toast.success("Company created successfully");

      }

    } catch (error) {
      toast.error(error.message || "Failed to save company profile");

    }

  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">

      <div className="w-full max-w-4xl">

        {/* Dynamic Header */}

        <div className="mb-6">

          <h1 className="text-2xl font-semibold flex items-center gap-2">

            <HiOutlineBuildingOffice size={26} />

            {company
              ? "Company Profile"
              : "Create Company Profile"}

          </h1>

          <p className="text-gray-500 mt-1">

            {company
              ? "Manage and update your company information"
              : "Add your company details to start posting jobs"}

          </p>

        </div>


        {/* Card */}

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-xl font-semibold mb-1">

            {company
              ? "Edit Company Information"
              : "Add Company Information"}

          </h2>

          <p className="text-gray-500 mb-6">

            {company
              ? "Update your company details visible to job seekers"
              : "This information will be visible to job seekers"}

          </p>


          <form onSubmit={handleSubmit} className="space-y-5">


            {/* Company Name */}
            <Input
              label="Company Name *"
              icon={<HiOutlineBuildingOffice />}
              name="companyName"
              required
              value={formData.companyName || ""}
              onChange={handleChange}
            />


            {/* Description */}
            <Textarea
              label="Description"
              icon={<HiOutlineDocumentText />}
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />


            {/* Website & Location */}
            <div className="grid md:grid-cols-2 gap-4">

              <Input
                label="Website"
                icon={<HiOutlineGlobeAlt />}
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
              />

              <Input
                label="Location"
                icon={<HiOutlineMapPin />}
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
              />

            </div>


            {/* Industry & Size */}
            <div className="grid md:grid-cols-2 gap-4">

              <Select
                label="Industry *"
                icon={<HiOutlineBuildingOffice />}
                name="industry"
                required
                value={formData.industry || ""}
                onChange={handleChange}
                options={[
                  "IT / Software",
                  "Finance / Banking",
                  "Healthcare",
                  "Education",
                  "Manufacturing",
                  "Retail",
                  "E-commerce",
                  "Telecom",
                  "Construction",
                  "Automobile",
                  "Media & Entertainment",
                  "Logistics",
                  "Hospitality",
                  "Real Estate",
                  "Other"
                ]}
              />

              <Select
                label="Company Size"
                icon={<HiOutlineUsers />}
                name="companySize"
                value={formData.companySize || ""}
                onChange={handleChange}
                options={[
                  "1-10",
                  "11-50",
                  "51-200",
                  "201-500",
                  "501-1000",
                  "1000+"
                ]}
              />

            </div>


            {/* Founded Year */}
            <Input
              label="Founded Year"
              icon={<HiOutlineCalendar />}
              name="foundedYear"
              type="number"
              value={formData.foundedYear || ""}
              onChange={handleChange}
            />


            {/* Email & Phone */}
            <div className="grid md:grid-cols-2 gap-4">

              <Input
                label="Email"
                icon={<HiOutlineEnvelope />}
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />

              <Input
                label="Phone"
                icon={<HiOutlinePhone />}
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />

            </div>


            {/* Social */}
            <div className="grid md:grid-cols-2 gap-4">

              <Input
                label="LinkedIn"
                icon={<FaLinkedin />}
                name="linkedin"
                value={formData.linkedin || ""}
                onChange={handleChange}
              />

              <Input
                label="Twitter"
                icon={<FaTwitter />}
                name="twitter"
                value={formData.twitter || ""}
                onChange={handleChange}
              />

            </div>


            {/* Logo URL */}
            <Input
              label="Logo URL"
              icon={<HiOutlinePhoto />}
              name="logoUrl"
              value={formData.logoUrl || ""}
              onChange={handleChange}
            />


            {/* Upload Logo */}
            <div>

              <label className="text-sm font-medium">
                Upload Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="mt-1"
              />

            </div>


            {/* Logo Preview */}
            {logoPreview && (

              <div className="flex items-center gap-4">

                <img
                  src={logoPreview}
                  className="h-16 w-16 rounded border object-cover"
                />

                <button
                  type="button"
                  onClick={removeLogo}
                  className="text-red-500 flex items-center gap-1"
                >
                  <HiOutlineTrash />
                  Remove Logo
                </button>

              </div>

            )}


            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium hover:opacity-90"
            >
              {company
                ? "Update Company Profile"
                : "Create Company Profile"}
            </button>


          </form>

        </div>

      </div>

    </div>

  );

};


export default CompanyProfile;



/* Reusable Components */

const Input = ({ label, icon, ...props }) => (

  <div>

    <label className="text-sm font-medium">
      {label}
    </label>

    <div className="flex items-center border rounded-lg mt-1 px-3">

      <span className="text-gray-400 mr-2">
        {icon}
      </span>

      <input {...props} className="w-full py-2 outline-none" />

    </div>

  </div>

);


const Textarea = ({ label, icon, ...props }) => (

  <div>

    <label className="text-sm font-medium">
      {label}
    </label>

    <div className="flex border rounded-lg mt-1 px-3">

      <span className="text-gray-400 mr-2 mt-2">
        {icon}
      </span>

      <textarea {...props} className="w-full py-2 outline-none" />

    </div>

  </div>

);


const Select = ({ label, icon, options, ...props }) => (

  <div>

    <label className="text-sm font-medium">
      {label}
    </label>

    <div className="flex items-center border rounded-lg mt-1 px-3">

      <span className="text-gray-400 mr-2">
        {icon}
      </span>

      <select {...props} className="w-full py-2 outline-none">

        <option value="">
          Select {label}
        </option>

        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}

      </select>

    </div>

  </div>

);

'use client'

import { useState, useEffect, useRef } from 'react';
import { Input, Button, Avatar, Textarea, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useSession } from 'next-auth/react';
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, Building, Briefcase, Globe, Hash, Users, Mail, Eye, EyeOff, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FilePicker from '@/components/FilePicker';
import convertToBase64 from '@/components/convertToBase64';

export default function CompanyAccountPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/companies?email=${session.user.email}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setCompanyData(data);
          setPreviewUrl(data.logo);
        } catch (error) {
          console.error('Failed to fetch company data:', error);
          toast.error(`Failed to load company data: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCompanyData();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    const base64 = await convertToBase64(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(base64);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/companies', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...companyData,
          logo: previewUrl,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setCompanyData(updatedData);
        setPreviewUrl(updatedData.logo);
        toast.success('Company profile updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error updating company profile:', errorData);
        toast.error(`Failed to update company profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating company profile:', error);
      toast.error(`An error occurred while updating the company profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password to delete your account');
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setShowConfirmDialog(false);

    try {
      const response = await fetch(`/api/companies?email=${companyData.email}&password=${deletePassword}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Your company account has been deleted successfully');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        const data = await response.json();
        toast.error(`Failed to delete company account: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting company account:', error);
      toast.error(`An error occurred while deleting the company account: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <FuturisticLoader />
      </Container>
    );
  }

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Account Deletion</h3>
            <p className="mb-4">Are you sure you want to delete your company account? This action is irreversible.</p>
            <div className="flex justify-end space-x-4">
              <Button color="default" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
              <Button color="danger" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Company Account</h1>
        </div>
        <div className="mt-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 h-fit">
              <Card className="h-fit">
                <CardBody className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold my-4">{companyData.companyName}</h2>
                  <Avatar
                    src={previewUrl || "/assets/company-logo-placeholder.png"}
                    className="w-32 h-32 mb-4"
                  />
                  <FilePicker handleFileUpload={handleFileChange} fileName={file ? file.name : 'No file chosen'} />
                </CardBody>
              </Card>
              <Card className="my-8 px-2 bg-red-100 text-center">
                <CardHeader>
                  <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
                </CardHeader>
                <CardBody className="flex flex-col items-center">
                  <p className="mb-4">Deleting your company account will remove all your data and is irreversible.</p>
                  <div className="w-full max-w-xs">
                    <Input
                      className="mb-4"
                      type={showPassword ? "text" : "password"}
                      label="Enter your password to delete"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      endContent={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="flex items-center justify-center h-full"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                    />
                  </div>
                  <Button
                    color="danger"
                    disabled={isDeleting}
                    onClick={handleDeleteAccount}
                    startContent={<Trash2Icon />}
                  >
                    {isDeleting ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    ) : 'Delete Account'}
                  </Button>
                </CardBody>
              </Card>
            </div>
            <form onSubmit={handleSubmit} className="md:w-2/3 space-y-4">
              <Input
                label="Company Name"
                name="companyName"
                value={companyData.companyName}
                onChange={handleChange}
                startContent={<Building size={18} />}
              />
              <Input
                label="Email"
                name="email"
                value={companyData.email}
                onChange={handleChange}
                disabled
                startContent={<Mail size={18} />}
              />
              <Input
                label="Industry"
                name="industry"
                value={companyData.industry}
                onChange={handleChange}
                startContent={<Briefcase size={18} />}
              />
              <Input
                label="Website"
                name="website"
                value={companyData.website}
                onChange={handleChange}
                startContent={<Globe size={18} />}
              />
              <Input
                label="Location"
                name="location"
                value={companyData.location}
                onChange={handleChange}
                startContent={<Hash size={18} />}
              />
              <Input
                label="Company Size"
                name="size"
                type="number"
                value={companyData.size}
                onChange={handleChange}
                startContent={<Users size={18} />}
              />
              <Textarea
                label="Company Description"
                name="description"
                value={companyData.description}
                onChange={handleChange}
              />
              <Button
                className="btnPri w-full"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                ) : 'Save Changes'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
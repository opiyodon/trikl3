'use client'

import { useState, useEffect, useRef } from 'react';
import { Input, Button, Avatar, Textarea, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useSession } from 'next-auth/react';
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, User, Briefcase, GraduationCap, Hash, Book, Lightbulb, FileText, Mail, Eye, EyeOff, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FilePicker from '@/components/FilePicker';
import convertToBase64 from '@/components/convertToBase64';

export default function AccountPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const skillInputRef = useRef(null);

  const cleanSkill = (skill) => {
    return skill.replace(/["\\\[\]]/g, '').trim();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/students?email=${session.user.email}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setUserData(data);
          setPreviewUrl(data.profilePicture);
          const cleanedSkills = (data.skills || []).map(cleanSkill).filter(skill => skill !== '');
          setSkills(cleanedSkills);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          toast.error(`Failed to load user data: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
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

  const handleSkillInputChange = (e) => {
    setCurrentSkill(e.target.value);
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const skillsToAdd = currentSkill.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    if (skillsToAdd.length > 0) {
      setSkills(prevSkills => [...new Set([...prevSkills, ...skillsToAdd])]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(prevSkills => prevSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanedSkills = skills.map(cleanSkill).filter(skill => skill !== '');

    try {
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          institution: userData.institution,
          fieldOfStudy: userData.fieldOfStudy,
          yearOfStudy: userData.yearOfStudy,
          registrationNumber: userData.registrationNumber,
          course: userData.course,
          bio: userData.bio,
          skills: cleanedSkills,
          profilePicture: previewUrl,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setSkills(cleanedSkills);
        setPreviewUrl(updatedData.profilePicture);
        toast.success('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error updating profile:', errorData);
        toast.error(`Failed to update profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(`An error occurred while updating the profile: ${error.message}`);
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
      const response = await fetch(`/api/students?email=${userData.email}&password=${deletePassword}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Your account has been deleted successfully');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        const data = await response.json();
        toast.error(`Failed to delete account: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(`An error occurred while deleting the account: ${error.message}`);
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
            <p className="mb-4">Are you sure you want to delete your account? This action is irreversible.</p>
            <div className="flex justify-end space-x-4">
              <Button color="default" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
              <Button color="danger" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Account</h1>
        </div>
        <div className="mt-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 h-fit">
              <Card className="h-fit">
                <CardBody className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold my-4">{userData.fullName}</h2>
                  <Avatar
                    src={previewUrl || "/assets/avatar.png"}
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
                  <p className="mb-4">Deleting your account will remove all your data and is irreversible.</p>
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
                label="Full Name"
                name="fullName"
                value={userData.fullName}
                onChange={handleChange}
                startContent={<User size={18} />}
              />
              <Input
                label="Email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                disabled
                startContent={<Mail size={18} />}
              />
              <Input
                label="Institution"
                name="institution"
                value={userData.institution}
                onChange={handleChange}
                startContent={<Briefcase size={18} />}
              />
              <Input
                label="Field of Study"
                name="fieldOfStudy"
                value={userData.fieldOfStudy}
                onChange={handleChange}
                startContent={<GraduationCap size={18} />}
              />
              <Input
                label="Year of Study"
                name="yearOfStudy"
                value={userData.yearOfStudy}
                onChange={handleChange}
                type="number"
                startContent={<Hash size={18} />}
              />
              <Input
                label="Registration Number"
                name="registrationNumber"
                value={userData.registrationNumber}
                onChange={handleChange}
                startContent={<FileText size={18} />}
              />
              <Input
                label="Course"
                name="course"
                value={userData.course}
                onChange={handleChange}
                startContent={<Book size={18} />}
              />
              <div className="w-full relative">
                <div
                  className="w-full min-h-[80px] flex flex-col justify-start gap-1.5 bg-default-100 hover:bg-default-200 rounded-medium px-3 py-2 transition-background"
                  tabIndex={0}
                >
                  <label className="text-xs font-medium text-foreground-600">Skills</label>
                  <div className="flex items-center gap-2">
                    <Lightbulb size={18} className="text-foreground-900" />
                    <input
                      value={currentSkill}
                      onChange={handleSkillInputChange}
                      onKeyDown={handleSkillInputKeyDown}
                      ref={skillInputRef}
                      onBlur={addSkill}
                      placeholder="Enter skills and press Enter or Comma"
                      className="w-full bg-transparent border-none outline-none p-0 font-normal text-small text-foreground-600 placeholder:text-inherit"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="bg-purple-300 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        {skill}
                        <button onClick={(e) => { e.preventDefault(); removeSkill(skill); }} className="ml-2 text-purple-500 hover:text-purple-700 bg-default-100 w-4 h-4 rounded-full p-1 flex items-center">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Textarea
                label="Bio"
                name="bio"
                value={userData.bio}
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
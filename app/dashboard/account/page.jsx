'use client'

import { useState } from 'react';
import { Input, Button, Avatar, Progress, Textarea } from "@nextui-org/react";

export default function AccountPage() {
  const [profileStrength, setProfileStrength] = useState(70);
  const [userData, setUserData] = useState({
    fullName: 'Don Artkins',
    email: 'donartkins@gmail.com',
    university: 'Kabarak University',
    fieldOfStudy: 'Information Technology',
    skills: 'JavaScript, React, Node JS, Next JS, Tailwind CSS',
    bio: 'Passionate about technology and innovation.',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the userData to your backend
    console.log(userData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Avatar src="/assets/avatar.png" className="w-32 h-32 mb-4" />
          <Button>Upload new picture</Button>
        </div>
        <form onSubmit={handleSubmit} className="md:w-2/3">
          <Input
            label="Full Name"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            className="mb-4"
          />
          <Input
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="mb-4"
          />
          <Input
            label="University"
            name="university"
            value={userData.university}
            onChange={handleChange}
            className="mb-4"
          />
          <Input
            label="Field of Study"
            name="fieldOfStudy"
            value={userData.fieldOfStudy}
            onChange={handleChange}
            className="mb-4"
          />
          <Input
            label="Skills"
            name="skills"
            value={userData.skills}
            onChange={handleChange}
            className="mb-4"
          />
          <Textarea
            label="Bio"
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            className="mb-4"
          />
          <Button color="primary" type="submit">Save Changes</Button>
        </form>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Profile Strength</h2>
        <Progress value={profileStrength} className="mb-2" />
        <p>Your profile is {profileStrength}% complete</p>
      </div>
    </div>
  );
}
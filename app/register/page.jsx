'use client'

import { useState } from 'react';
import { Input, Button, Checkbox, Link } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    fieldOfStudy: '',
    agreeTerms: false,
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the registration logic
    console.log(formData);
    // Redirect to home page after successful registration
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Create an Account</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="University"
          name="university"
          value={formData.university}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Field of Study"
          name="fieldOfStudy"
          value={formData.fieldOfStudy}
          onChange={handleChange}
          className="mb-4"
        />
        <Checkbox
          name="agreeTerms"
          isSelected={formData.agreeTerms}
          onValueChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked }))}
          className="mb-4"
        >
          I agree to the terms and conditions
        </Checkbox>
        <Button color="primary" type="submit" className="w-full mb-4">
          Sign Up
        </Button>
        <p className="text-center">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
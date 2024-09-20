'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Checkbox, Link, Switch, Progress } from "@nextui-org/react";
import { useRouter } from 'next/navigation'; // Correct router import
import { signIn } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'lucide-react';
import FuturisticLoader from '@/components/FuturisticLoader';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    fieldOfStudy: '',
    companyName: '',
    industry: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Simulate loading effect
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  // Handle form change and field validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'fullName':
      case 'companyName':
        if (!value.trim()) newErrors[name] = 'This field is required';
        else delete newErrors[name];
        break;
      case 'email':
        if (!value.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Email is invalid';
        else delete newErrors.email;
        break;
      case 'password':
        if (!value) newErrors.password = 'Password is required';
        else if (value.length < 8) newErrors.password = 'Password must be at least 8 characters';
        else delete newErrors.password;
        break;
      case 'confirmPassword':
        if (value !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
        break;
      case 'agreeTerms':
        if (!value) newErrors.agreeTerms = 'You must agree to the terms and conditions';
        else delete newErrors.agreeTerms;
        break;
      default:
        if (!value.trim()) newErrors[name] = 'This field is required';
        else delete newErrors[name];
    }
    setErrors(newErrors);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 50) return 'danger';
    if (strength < 75) return 'warning';
    return 'success';
  };

  // Form submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before proceeding
    const newErrors = {};
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));

    if (Object.keys(errors).length > 0) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType: isCompany ? 'company' : 'student',
          email: formData.email,
          password: formData.password,
          fullName: isCompany ? formData.companyName : formData.fullName,
          ...(isCompany
            ? { industry: formData.industry }
            : {
              institution: formData.institution,
              fieldOfStudy: formData.fieldOfStudy,
              yearOfStudy: '',
              registrationNumber: '',
              profilePicture: '',
              course: '',
              skills: '',
              bio: '',
            }),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Registration successful! Profile strength: ${data.profileStrength}%`);

        const signInResult = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
          userType: isCompany ? 'company' : 'student',
        });

        if (signInResult.error) {
          toast.error('Registration successful, but automatic login failed. Please log in manually.');
          setTimeout(() => router.push('/login'), 2000);
        } else {
          toast.success('Login successful');
          setTimeout(() => router.push(isCompany ? '/company-dashboard' : '/student-dashboard'), 2000);
        }
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <FuturisticLoader />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-8 text-center">Create an Account</h1>
      <div className="mb-6 text-center">
        <h2 className="text-xl mb-2">Are you a student or a company?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Choose your account type to see the appropriate registration fields.
        </p>
        <div className="flex justify-center items-center">
          <span className={`mr-2 ${!isCompany ? 'font-bold' : ''}`}>Student</span>
          <Switch
            checked={isCompany}
            onChange={() => setIsCompany(!isCompany)}
            color="secondary"
          />
          <span className={`ml-2 ${isCompany ? 'font-bold' : ''}`}>Company</span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          label={isCompany ? "Company Name" : "Full Name"}
          name={isCompany ? "companyName" : "fullName"}
          value={isCompany ? formData.companyName : formData.fullName}
          onChange={handleChange}
          className="mb-4"
          isInvalid={errors.companyName || errors.fullName}
          errorMessage={errors.companyName || errors.fullName}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4"
          isInvalid={errors.email}
          errorMessage={errors.email}
        />
        <div className="mb-4 relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            isInvalid={errors.password}
            errorMessage={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <Progress
          value={passwordStrength}
          color={getPasswordStrengthColor(passwordStrength)}
          className="mb-2"
        />
        <p className="text-sm mb-4">Password strength: {passwordStrength}%</p>
        <div className="mb-4 relative">
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            isInvalid={errors.confirmPassword}
            errorMessage={errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {isCompany ? (
          <Input
            label="Industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="mb-4"
            isInvalid={errors.industry}
            errorMessage={errors.industry}
          />
        ) : (
          <>
            <Input
              label="Institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className="mb-4"
              isInvalid={errors.institution}
              errorMessage={errors.institution}
            />
            <Input
              label="Field of Study"
              name="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={handleChange}
              className="mb-4"
              isInvalid={errors.fieldOfStudy}
              errorMessage={errors.fieldOfStudy}
            />
          </>
        )}
        <Checkbox
          name="agreeTerms"
          isSelected={formData.agreeTerms}
          onValueChange={(checked) => handleChange({ target: { name: 'agreeTerms', type: 'checkbox', checked } })}
          className="mb-4"
        >
          I agree to the terms and conditions
        </Checkbox>
        {errors.agreeTerms && <p className="text-red-500 text-sm mb-4">{errors.agreeTerms}</p>}
        <Button
          type="submit"
          className="btnPri w-full mb-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-2"></div>
              Registering...
            </>
          ) : `Register as ${isCompany ? 'Company' : 'Student'}`}
        </Button>
        <p className="text-center">
          Already have an account? <Link href="/login" className="text-pri">Log in</Link>
        </p>
      </form>
    </div>
  );
}

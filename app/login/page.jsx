'use client'

import { useState, useEffect } from 'react';
import { Input, Button, Checkbox, Link, Switch, Progress } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'lucide-react';
import FuturisticLoader from '@/components/FuturisticLoader';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'email':
        if (!value.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Email is invalid';
        else delete newErrors.email;
        break;
      case 'password':
        if (!value) newErrors.password = 'Password is required';
        else delete newErrors.password;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => validateField(key, formData[key]));
    if (Object.keys(errors).length > 0) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        userType: isCompany ? 'company' : 'student',
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Login successful');
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
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
      <h1 className="text-3xl font-bold mb-8 text-center">Log In</h1>
      <div className="mb-6 text-center">
        <h2 className="text-xl mb-2">Are you a student or a company?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Choose your account type to log in to the appropriate portal.
        </p>
        <div className="flex justify-center items-center">
          <span className={`mr-2 ${!isCompany ? 'font-bold' : ''}`}>Student</span>
          <Switch checked={isCompany} onChange={() => setIsCompany(!isCompany)} />
          <span className={`ml-2 ${isCompany ? 'font-bold' : ''}`}>Company</span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
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
        <div className="flex justify-between items-center mb-4">
          <Checkbox
            name="rememberMe"
            isSelected={formData.rememberMe}
            onValueChange={(checked) => handleChange({ target: { name: 'rememberMe', type: 'checkbox', checked } })}
          >
            Remember me
          </Checkbox>
          <Link href="/forgot-password" className="text-pri">Forgot password?</Link>
        </div>
        <Button 
          type="submit" 
          className="btnPri w-full mb-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          ) : `Log In as ${isCompany ? 'Company' : 'Student'}`}
        </Button>
        <p className="text-center">
          Don't have an account? <Link href="/register" className="text-pri">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
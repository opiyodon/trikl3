'use client'

import { useState } from 'react';
import { Input, Button, Checkbox, Link } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the login logic
    console.log({ email, password, rememberMe });
    // Redirect to home page after successful login
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Log In</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <div className="flex justify-between items-center mb-4">
          <Checkbox
            isSelected={rememberMe}
            onValueChange={setRememberMe}
          >
            Remember me
          </Checkbox>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
        <Button color="primary" type="submit" className="w-full mb-4">
          Log In
        </Button>
        <p className="text-center">
          Don't have an account? <Link href="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
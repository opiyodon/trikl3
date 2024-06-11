'use client'; 

import Head from 'next/head';
import { useRouter } from 'next/navigation'; // Use next/navigation

export default function Home() {
  const router = useRouter();

  const navItems = [
    { name: 'Internships', href: '/' },
    { name: 'Resources', href: '/resources' },
    { name: 'Events', href: '/events' },
    { name: 'Post Internship', href: '/post-internship' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Trikl3</title>
      </Head>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Trikl3</h1>
          <nav className="flex items-center space-x-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md transition ${
                  router.pathname === item.href
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-white hover:bg-blue-500'
                }`}
              >
                {item.name}
              </a>
            ))}
            <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full ml-4" />
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900">Trikl3</h2>
          <p className="mt-4 text-gray-600">
            Trikl3 is a platform that connects Kenyan tech students with internship opportunities at leading tech companies. Our AI-driven matching algorithm helps you find internships that are right for you.
          </p>
          <div className="mt-6">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md transition hover:bg-blue-600">Get started</button>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-medium text-gray-900">Your activity</h3>
            <div className="mt-4 space-y-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-lg font-medium text-gray-800">Complete your profile</h4>
                <p className="text-gray-600">Add more information to get better matches</p>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md transition hover:bg-blue-600">Complete profile</button>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="text-lg font-medium text-gray-800">Apply to internships</h4>
                <p className="text-gray-600">Start applying to internships</p>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md transition hover:bg-blue-600">View internships</button>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-medium text-gray-900">Recommended for you</h3>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  {[
    { company: <a href="https://www.facebookcareers.com/" style={{ color: 'blue' }}>Facebook</a>, position: 'Software Engineer Intern', logo: '/images/facebook-logo.webp' },
    { company: <a href="https://careers.google.com/" style={{ color: 'blue' }}>Google</a>, position: 'Product Design Intern', logo: '/images/google-logo.webp' },
    { company: <a href="https://jobs.netflix.com/" style={{ color: 'blue' }}>Netflix</a>, position: 'Data Analyst Intern', logo: '/images/netflix-logo.webp' },
    { company: <a href="https://www.apple.com/jobs/us/" style={{ color: 'blue' }}>Apple</a>, position: 'Software Engineer Intern', logo: '/images/apple-logo.webp' },
    { company: <a href="https://www.amazon.jobs/" style={{ color: 'blue' }}>Amazon</a>, position: 'Product Design Intern', logo: '/images/amazon-logo.webp' }
  ].map((internship, index) => (
    <div key={index} className="bg-white p-4 rounded shadow-sm flex flex-col items-center">
      <img src={internship.logo} alt={`${internship.company} logo`} className="w-16 h-16 mb-4" />
      <h4 className="text-lg font-medium text-gray-800">{internship.position}</h4>
      <p className="text-gray-600">{internship.company}</p>
    </div>
  ))}
</div>

          </div>
        </div>
      </main>
    </div>
  );
}

# Trikl3

## About the Project

Trikl3 is a web-based platform designed to bridge the gap between Kenyan tech students and internship opportunities. Our mission is to address the challenges faced by students in finding relevant internships that align with their skills and career aspirations.

Website: [https://trikl3.vercel.app/](https://trikl3.vercel.app/)

### Key Features

- Centralized database of tech companies and startups in Kenya
- Personalized recommendations for internships and attachment opportunities
- User-friendly interface for both students and employers

## Getting Started

These instructions will help you set up a local copy of the project for development and testing purposes.

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/trikl3.git
   cd trikl3
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
trikl3/
│
├── app/
│   ├── page.js
│   └── layout.js
├── components/
│   ├── Header.js
│   ├── Footer.js
│   └── ...
├── pages/
│   ├── api/
│   │   └── ...
│   ├── students/
│   └── companies/
├── styles/
│   └── globals.css
├── public/
│   └── ...
├── lib/
│   └── ...
├── package.json
├── README.md
├── LICENSE.md
└── CONTRIBUTING.md
```

## Features in Detail

1. **Student Profiles**: Students can create and manage their profiles, showcasing their skills, projects, and educational background.

2. **Company Listings**: Tech companies can create profiles and post internship opportunities.

3. **Opportunity Matching**: The platform provides personalized internship recommendations based on student profiles and company requirements.

4. **Application Tracking**: Students can track the status of their internship applications through the platform.

## Deployment

The project is deployed on Vercel. To deploy your own instance:

1. Create a Vercel account if you haven't already.
2. Connect your GitHub repository to Vercel.
3. Configure your environment variables in the Vercel dashboard.
4. Deploy the project.

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Contributing

We welcome contributions to Trikl3! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Next.js team for the excellent framework
- All the tech companies and students in Kenya who have provided valuable feedback

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository or contact our support team at support@trikl3.com.
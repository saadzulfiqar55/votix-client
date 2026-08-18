// src/pages/HomePage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useContext(AuthContext);

  const teamMembers = [
    { name: "Salwa", id: "073117" },
    { name: "Tooba", id: "073139" },
    { name: "Um e Rubab", id: "073109" },
    { name: "Laiba", id: "056504" },
  ];

  const techStack = [
    {
      name: "React.js",
      category: "Frontend Library",
      icon: "⚛️",
      description: "Powers the dynamic, single-page user interface with reusable stateful components and client-side routing.",
    },
    {
      name: "Tailwind CSS",
      category: "Styling Framework",
      icon: "🎨",
      description: "Provides utility-first styling for a sleek, modern, fully responsive dark-mode glassmorphic design.",
    },
    {
      name: "MongoDB",
      category: "Database",
      icon: "🍃",
      description: "NoSQL document database storing user profiles, election configurations, candidates, and secure cast votes.",
    },
    {
      name: "Express.js & Node.js",
      category: "Backend Engine",
      icon: "🚀",
      description: "RESTful API web server handling routing, election logic, candidate management, and real-time tally calculations.",
    },
    {
      name: "JWT Authentication",
      category: "Security & Tokens",
      icon: "🔑",
      description: "JSON Web Tokens ensure secure stateless user sessions, identity verification, and anti-tampering fraud checks.",
    },
    {
      name: "MERN Architecture",
      category: "Full-Stack Integration",
      icon: "⚡",
      description: "End-to-end JavaScript stack delivering lightning-fast data flow between client interface and backend database.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
            Final Year Project
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Secure & Effortless Digital Voting
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Votix empowers organizations and communities to create, manage, and vote in elections securely from anywhere — preventing double voting and ensuring complete fairness.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to={user ? "/create-election" : "/login"}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/25 transition"
            >
              Create Election
            </Link>
            <Link
              to={user ? "/elections" : "/login"}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition"
            >
              Cast Vote
            </Link>
          </div>
        </section>

        {/* Technologies Used Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Technologies & Architecture
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Built with modern full-stack web technologies to guarantee high availability, responsive UX, and robust voter security.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/50 backdrop-blur-sm transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{tech.icon}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-700/50 text-indigo-300 border border-slate-600/40">
                    {tech.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {tech.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mt-2">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Project Abstract */}
        <section className="p-8 rounded-3xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Project Abstract</h2>
          <p className="text-slate-300 leading-relaxed">
            Votix is an online voting application engineered to simplify and secure the election process. Developed using the MERN stack (MongoDB, Express, React, Node.js), it allows registered voters to participate from anywhere while blocking unauthorized multiple votes. Administrators gain an intuitive dashboard to create elections, publish candidate profiles, and review real-time tally statistics — ensuring a simple, transparent, and error-free voting experience.
          </p>
        </section>
      </main>

      {/* Footer / Team Info */}
      <footer className="border-t border-slate-800 bg-slate-950/60 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-indigo-400 mb-3">
              Project Team
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-300">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <span className="font-medium text-white">{member.name}</span>
                  <span className="text-slate-500 font-mono text-xs">({member.id})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-indigo-400 mb-1">
              Project Advisor
            </h3>
            <p className="text-base font-semibold text-white">Dr. Muhammad Asif</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
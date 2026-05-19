'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Zap, Mic, Volume2, MessageSquare } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Mic,
      title: 'Real-Time Voice Input',
      description: 'Speak naturally and let the AI understand your commands instantly',
    },
    {
      icon: Zap,
      title: 'Intelligent AI',
      description: 'Powered by GPT-4o for human-like conversations',
    },
    {
      icon: Volume2,
      title: 'Natural Voice Output',
      description: 'Listen to responses in natural human voice using ElevenLabs',
    },
    {
      icon: MessageSquare,
      title: 'Conversation History',
      description: 'Keep track of all your conversations and revisit anytime',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">
      <Navbar currentPage="home" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Meet <span className="gradient-text">Jarvis</span>, Your AI Voice Assistant
            </h1>
            <p className="text-xl text-dark-400 mb-8 max-w-2xl mx-auto">
              Experience the future of AI interaction. Talk naturally with advanced AI that
              listens, understands, and responds with a human-like voice.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/assistant">
                <Button size="lg" variant="primary">
                  Launch Assistant
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="secondary">
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-20 right-20 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-40 left-20 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Everything you need for seamless AI voice interaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-brand-500/50 transition-all duration-300 group"
              >
                <feature.icon className="w-10 h-10 text-brand-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-dark-800/50 border border-dark-700 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Built with Modern Stack</h2>
            <p className="text-dark-400 mb-8">
              Leveraging cutting-edge technologies for the best performance
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                'Next.js',
                'React',
                'TypeScript',
                'Tailwind CSS',
                'OpenAI GPT-4o',
                'ElevenLabs',
                'Deepgram',
                'Zustand',
              ].map((tech, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm font-medium"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-dark-400 mb-8 text-lg">
              Experience the power of AI voice conversation right now
            </p>
            <Link href="/assistant">
              <Button size="lg" variant="primary">
                Open Jarvis AI
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
